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
    <header className="glass-nav sticky top-0 z-30 px-6 h-14 flex items-center justify-between shadow-lg">
      {/* Brand Logo & Tag */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentTab('dashboard')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-all">
          <KeyRound size={18} />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-black text-base tracking-wider text-white">KEYSTONE</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-sm hidden sm:inline-flex items-center gap-1">
            <Sparkles size={10} /> FIELD OS
          </span>
        </div>
      </div>

      {/* Global Search Shortcut & Actions */}
      {user && (
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-950/70 hover:bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-400 cursor-pointer transition-all w-64 justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-500" />
              <span>Search work orders, sites...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
          </div>

          <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent hover:border-slate-800 transition-all cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-[#060913]"></span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 bg-slate-900/90 pl-1.5 pr-3 py-1 rounded-xl border border-white/10 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user.fullName.charAt(0)}
            </div>
            <div className="text-left text-xs hidden sm:block">
              <div className="font-bold text-slate-100 leading-none">{user.fullName}</div>
              <div className="text-cyan-400 font-mono text-[9px] uppercase tracking-wider mt-0.5">{user.role}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
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

