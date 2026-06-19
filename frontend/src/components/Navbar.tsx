import { useState } from 'react';
import { Award, Bell, LogOut, Menu, ChevronDown } from 'lucide-react';

interface NavbarProps {
  userEmail: string;
  userName: string;
  onLogout: () => void;
  onMenuToggle: () => void;
}

export default function Navbar({
  userEmail,
  userName,
  onLogout,
  onMenuToggle
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Dummy notification items
  const notifications = [
    { id: 1, text: "React skill gap analysis completed", time: "5 mins ago", unread: true },
    { id: 2, text: "New resource recommended for Spring Boot", time: "1 hour ago", unread: true },
    { id: 3, text: "Proficiency score increased to Advanced in Git", time: "1 day ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="glassmorphism sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between border-b border-slate-900">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 focus:outline-none transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-2.5">
          <div className="accent-gradient p-2 rounded-xl text-white shadow-lg shadow-blue-500/10">
            <Award className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white select-none">
            Skill Gap <span className="text-blue-400">Analyzer</span>
          </span>
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center space-x-4">
        {/* Notification Section */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className={`p-2 rounded-xl border transition-all duration-200 relative ${
              notificationsOpen 
                ? 'bg-slate-900 border-slate-800 text-white' 
                : 'bg-transparent border-transparent text-slate-450 hover:bg-slate-900/40 hover:text-white'
            }`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl glassmorphism border border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 border-b border-slate-900 flex justify-between items-center bg-slate-900/40">
                <span className="text-sm font-bold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-900 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className={`p-4 hover:bg-slate-900/30 transition-colors cursor-pointer flex items-start space-x-2.5 ${item.unread ? 'bg-slate-900/10' : ''}`}>
                    <div className={`h-1.5 w-1.5 rounded-full mt-2 shrink-0 ${item.unread ? 'bg-blue-400' : 'bg-slate-700'}`} />
                    <div className="space-y-0.5">
                      <p className={`text-xs leading-relaxed ${item.unread ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>
                        {item.text}
                      </p>
                      <span className="text-[10px] text-slate-500 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-900 bg-slate-900/20">
                <button 
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center space-x-2 p-1 pr-3 sm:pr-4 rounded-xl hover:bg-slate-900/50 border border-transparent hover:border-slate-800/40 transition-all duration-200"
          >
            {/* User Avatar Circle */}
            <div className="h-8 w-8 rounded-lg accent-gradient text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/10 uppercase select-none">
              {userName.charAt(0)}
            </div>
            {/* User details (Hidden on mobile) */}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white truncate max-w-[100px] capitalize leading-none mb-0.5">{userName}</p>
              <p className="text-[10px] text-slate-550 truncate max-w-[120px] leading-none">{userEmail}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Panel */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl glassmorphism border border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-5 border-b border-slate-900 bg-slate-900/40">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-10 w-10 rounded-lg accent-gradient text-white flex items-center justify-center font-bold text-base uppercase">
                    {userName.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white capitalize leading-none mb-1">{userName}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[160px] leading-none">{userEmail}</p>
                  </div>
                </div>
                <span className="inline-flex items-center text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Pro Member
                </span>
              </div>
              <div className="p-2.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-slate-350 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-200 text-sm font-medium text-left"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Log Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
