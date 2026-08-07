import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, KeyRound, Shield, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-nav sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentTab('dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
          <KeyRound size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-lg text-white tracking-wider">KEYSTONE</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">FSM OS</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">Field Operations Platform</p>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user.fullName.charAt(0)}
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-slate-100">{user.fullName}</div>
              <div className="text-blue-400 font-mono text-[10px] uppercase tracking-wider">{user.role}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-red-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            title="Logout"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};
