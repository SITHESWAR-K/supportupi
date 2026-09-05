import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FirebaseConfigNotice } from './components/FirebaseConfigNotice';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CreateEditPage } from './pages/CreateEditPage';
import { SupportPage } from './pages/SupportPage';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <FirebaseConfigNotice />
          <Navbar />
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* Creator Dashboard & Page Management */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create" element={<CreateEditPage />} />
            <Route path="/dashboard/edit/:id" element={<CreateEditPage />} />

            {/* Public Support Page: supportupi.web.app/{title} */}
            <Route path="/:slug" element={<SupportPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
