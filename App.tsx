
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Podcast from './pages/Podcast';
import Books from './pages/Books';
import Merch from './pages/Merch';
import About from './pages/About';
import Connect from './pages/Connect';
import DynamicPage from './pages/DynamicPage';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import { DataProvider, useData } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useData();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { isLoaded } = useData();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-start border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-start font-orbitron animate-pulse">UNSEALING NETWORK...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-grow pt-16">
          <Routes>
            {/* Public Routes - Accessible to all */}
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/books" element={<Books />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/about" element={<About />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/p/:slug" element={<DynamicPage />} />
            
            {/* Hidden Admin Entry */}
            <Route path="/veilcipher/login" element={<Login />} />
            
            {/* Protected Admin Command Center */}
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </DataProvider>
  );
};

export default App;
