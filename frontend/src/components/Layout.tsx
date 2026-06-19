import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear mock auth flags
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const userName = localStorage.getItem('userName') || userEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navbar - Sticky Top */}
      <Navbar
        userEmail={userEmail}
        userName={userName}
        onLogout={handleLogout}
        onMenuToggle={() => setMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Structural Layout Container (Sidebar + Content Panel) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-0 lg:gap-8">
        
        {/* Left Side Navigation Panel */}
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          onLogout={handleLogout}
          userEmail={userEmail}
        />

        {/* Right Main Page Panel */}
        <main className="flex-1 py-8 overflow-x-hidden min-h-[calc(100vh-160px)] flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Page Footer */}
          <footer className="border-t border-slate-900/60 py-6 text-center text-xs text-slate-500 mt-12 w-full">
            <p>&copy; {new Date().getFullYear()} Skill Gap Analyzer. Developed with React, TypeScript, Vite & Tailwind CSS.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
