import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from '../firebase';

// Helper to normalize slug for URL and doc ID uniqueness
export function sanitizeSlug(input) {
  if (!input) return '';
  return input
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getSlugKey(slug) {
  return sanitizeSlug(slug).toLowerCase();
}

/**
 * Validates a UPI ID against standard NPCI format (e.g. username@bank)
 */
export function validateUpiId(upiId) {
  if (!upiId) return false;
  const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return regex.test(upiId.trim());
}

/**
 * Checks whether a slug is available in Firestore
 * @param {string} rawSlug - the slug to test
 * @param {string|null} excludeKey - current doc key if editing
 * @returns {Promise<boolean>} - true if available, false if taken
 */
export async function checkSlugAvailability(rawSlug, excludeKey = null) {
  if (!db) return true;
  const slugKey = getSlugKey(rawSlug);
  if (!slugKey) return false;

  // If editing and slug hasn't changed
  if (excludeKey && slugKey === excludeKey) {
    return true;
  }

  try {
    const docRef = doc(db, 'pages', slugKey);
    const snap = await getDoc(docRef);
    return !snap.exists();
  } catch (err) {
    console.error('Error checking slug availability:', err);
    // In case of permission/offline or rules check, query collection
    try {
      const q = query(collection(db, 'pages'), where('slugKey', '==', slugKey));
      const qSnap = await getDocs(q);
      if (qSnap.empty) return true;
      if (excludeKey) {
        return qSnap.docs.every((d) => d.id === excludeKey);
      }
      return false;
    } catch (e) {
      console.warn('Fallback query check failed, assuming available for preview', e);
      return true;
    }
  }
}

/**
 * Creates a new support page in Firestore
 */
export async function createSupportPage(data, user) {
  if (!db) throw new Error('Database is not initialized.');
  if (!user) throw new Error('You must be signed in to create a support page.');

  const slug = sanitizeSlug(data.slug || data.title);
  const slugKey = getSlugKey(slug);

  if (!slugKey) throw new Error('Please provide a valid title or slug.');
  if (!validateUpiId(data.upiId)) throw new Error('Please enter a valid UPI ID (e.g. name@okhdfcbank).');

  // Strict collision check
  const isAvailable = await checkSlugAvailability(slugKey);
  if (!isAvailable) {
    throw new Error(`The slug "${slug}" is already taken by another creator. Please pick a unique title or slug.`);
  }

  const docRef = doc(db, 'pages', slugKey);

  const payload = {
    slug,
    slugKey,
    title: (data.title || slug).trim(),
    description: (data.description || '').trim(),
    upiId: data.upiId.trim(),
    defaultAmount: data.defaultAmount ? parseFloat(data.defaultAmount) : null,
    note: (data.note || '').trim(),
    ownerUid: user.uid,
    ownerName: user.displayName || 'Support Creator',
    ownerEmail: user.email || '',
    ownerPhoto: user.photoURL || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, payload);
  return { id: slugKey, ...payload };
}

/**
 * Updates an existing support page
 */
export async function updateSupportPage(currentSlugKey, data, user) {
  if (!db) throw new Error('Database is not initialized.');
  if (!user) throw new Error('You must be signed in to update a support page.');

  const newSlug = sanitizeSlug(data.slug || data.title);
  const newSlugKey = getSlugKey(newSlug);

  if (!newSlugKey) throw new Error('Invalid slug or title.');
  if (!validateUpiId(data.upiId)) throw new Error('Please enter a valid UPI ID.');

  const oldDocRef = doc(db, 'pages', currentSlugKey);
  const oldSnap = await getDoc(oldDocRef);

  if (!oldSnap.exists()) {
    throw new Error('The page you are trying to edit does not exist.');
  }

  const existingData = oldSnap.data();
  if (existingData.ownerUid !== user.uid) {
    throw new Error('You do not have permission to edit this page.');
  }

  // Check if slug changed
  if (newSlugKey !== currentSlugKey) {
    const isAvailable = await checkSlugAvailability(newSlugKey, currentSlugKey);
    if (!isAvailable) {
      throw new Error(`The slug "${newSlug}" is already taken. Please choose another.`);
    }

    // Create new doc and delete old
    const newDocRef = doc(db, 'pages', newSlugKey);
    const updatedPayload = {
      ...existingData,
      slug: newSlug,
      slugKey: newSlugKey,
      title: (data.title || newSlug).trim(),
      description: (data.description || '').trim(),
      upiId: data.upiId.trim(),
      defaultAmount: data.defaultAmount ? parseFloat(data.defaultAmount) : null,
      note: (data.note || '').trim(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(newDocRef, updatedPayload);
    await deleteDoc(oldDocRef);
    return { id: newSlugKey, ...updatedPayload };
  }

  // Same slug, simply update
  const updatedPayload = {
    title: (data.title || newSlug).trim(),
    description: (data.description || '').trim(),
    upiId: data.upiId.trim(),
    defaultAmount: data.defaultAmount ? parseFloat(data.defaultAmount) : null,
    note: (data.note || '').trim(),
    updatedAt: serverTimestamp(),
  };

  await updateDoc(oldDocRef, updatedPayload);
  return { id: currentSlugKey, ...existingData, ...updatedPayload };
}

/**
 * Deletes a support page
 */
export async function deleteSupportPage(slugKey, userUid) {
  if (!db) throw new Error('Database is not initialized.');
  const docRef = doc(db, 'pages', slugKey);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return;
  if (snap.data().ownerUid !== userUid) {
    throw new Error('You do not have permission to delete this page.');
  }

  await deleteDoc(docRef);
}

/**
 * Fetches all pages owned by a user
 */
export async function getUserSupportPages(userUid) {
  if (!db || !userUid) return [];

  try {
    const q = query(
      collection(db, 'pages'),
      where('ownerUid', '==', userUid)
    );
    const snap = await getDocs(q);
    const pages = [];
    snap.forEach((d) => {
      pages.push({ id: d.id, ...d.data() });
    });
    // Sort in memory by createdAt descending
    pages.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
    return pages;
  } catch (err) {
    console.error('Error fetching user support pages:', err);
    throw err;
  }
}

/**
 * Fetches a single page by its slug (public)
 */
export async function getSupportPageBySlug(rawSlug) {
  if (!db || !rawSlug) return null;
  const slugKey = getSlugKey(rawSlug);

  try {
    // 1. Direct doc lookup by key
    const docRef = doc(db, 'pages', slugKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }

    // 2. Query by slug or slugKey if case difference
    const q = query(collection(db, 'pages'), where('slugKey', '==', slugKey));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      const first = querySnap.docs[0];
      return { id: first.id, ...first.data() };
    }

    return null;
  } catch (err) {
    console.error('Error fetching support page by slug:', err);
    throw err;
  }
}
