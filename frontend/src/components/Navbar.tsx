import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, KeyRound, Search, Bell, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-nav sticky top-0 z-30 px-6 h-14 flex items-center justify-between shadow-sm">
      {/* Brand Logo & Tag */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentTab('dashboard')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
          <KeyRound size={18} />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold text-base tracking-wider text-slate-900">KEYSTONE</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 shadow-xs hidden sm:inline-flex items-center gap-1">
            <Sparkles size={10} className="text-sky-600" /> FIELD OS
          </span>
        </div>
      </div>

      {/* Global Search Shortcut & Actions */}
      {user && (
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-500 cursor-pointer transition-all w-64 justify-between">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <span>Search work orders, sites...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">⌘K</kbd>
          </div>

          <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white"></span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 bg-white pl-1.5 pr-3 py-1 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user.fullName.charAt(0)}
            </div>
            <div className="text-left text-xs hidden sm:block">
              <div className="font-bold text-slate-800 leading-none">{user.fullName}</div>
              <div className="text-sky-600 font-mono text-[9px] uppercase tracking-wider font-semibold mt-0.5">{user.role}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            title="Logout"
          >
            <LogOut size={15} />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};
