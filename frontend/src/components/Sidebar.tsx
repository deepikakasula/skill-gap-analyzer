import { NavLink } from 'react-router-dom';
import { BarChart2, Target, Compass, FileText, Settings, X, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userEmail: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  onLogout,
  userEmail
}: SidebarProps) {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart2 },
    { name: 'Skill Analysis', path: '/skill-analysis', icon: Target },
    { name: 'Learning Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950/80 border-r border-slate-900 lg:bg-transparent lg:border-r-0 justify-between select-none">
      {/* Sidebar Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-7">
        {/* Mobile Header: brand + Close Button */}
        <div className="flex lg:hidden justify-between items-center pb-4 border-b border-slate-900">
          <span className="text-sm font-bold tracking-tight text-white">Navigation</span>
          <button
            onClick={onClose}
            className="text-slate-450 hover:text-white p-1 rounded-lg hover:bg-slate-900 focus:outline-none transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 transition-all duration-200 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/15 shadow-sm shadow-blue-500/5'
                      : 'text-slate-400 border border-transparent hover:text-white hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Details (Hidden on Desktop since it is in Navbar) */}
      <div className="lg:hidden p-4 border-t border-slate-900 flex flex-col space-y-3">
        <span className="text-xs text-slate-500 truncate px-2">{userEmail}</span>
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center space-x-2.5 px-4 py-3 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200 text-xs font-semibold"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent Side Panel, md:min-w-64) */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-73px)] sticky top-[73px] self-start py-8 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar Overlay backdrop */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
          {/* Drawer Panel container */}
          <div className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] glassmorphism border-r border-slate-800 shadow-2xl z-50 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
          {/* Overlay Click Target to Close */}
          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
        </div>
      )}
    </>
  );
}
