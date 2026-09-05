/**
 * Dynamic SEO helper for single-page routing
 */
export function setPageSEO({
  title,
  description,
  canonicalUrl,
}) {
  const fullTitle = title
    ? `${title} | SupportUPI`
    : 'SupportUPI — Free UPI QR Generator | Accept Direct UPI Payments With 0% Fee';

  document.title = fullTitle;

  // Update meta description
  if (description) {
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', description);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);
  }

  // Update OpenGraph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', fullTitle);

  let twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', fullTitle);

  // Update canonical
  if (canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    }
  }
}
