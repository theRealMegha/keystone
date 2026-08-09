import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Kanban, Wrench, Users, Package, Building2, MapPin, UserCog, PlusCircle, ShieldCheck, Activity } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCreateModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, onOpenCreateModal }) => {
  const { user, hasRole } = useAuth();

  const isManagerOrDispatcher = hasRole('ADMIN', 'DISPATCHER');
  const isTechnician = hasRole('TECHNICIAN');
  const isCustomer = hasRole('CUSTOMER');

  return (
    <aside className="w-64 bg-[#090d18]/90 border-r border-white/5 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-56px)] select-none">
      <div className="space-y-6">
        {onOpenCreateModal && (isManagerOrDispatcher || isCustomer) && (
          <button
            onClick={onOpenCreateModal}
            className="ks-btn-primary w-full flex items-center justify-center gap-2.5 py-3 shadow-lg shadow-cyan-500/20 group relative overflow-hidden"
          >
            <PlusCircle size={18} className="transition-transform group-hover:rotate-90 duration-300" />
            <span>New Work Order</span>
          </button>
        )}

        <nav className="space-y-5">
          {isManagerOrDispatcher && (
            <>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
                  Operations Command
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentTab === 'dashboard'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard size={17} className={currentTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-500'} />
                      <span>Dashboard</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
                  Management & Assets
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => setCurrentTab('customers')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentTab === 'customers'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 size={17} className={currentTab === 'customers' ? 'text-cyan-400' : 'text-slate-500'} />
                      <span>Customers</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentTab('sites')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentTab === 'sites'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={17} className={currentTab === 'sites' ? 'text-cyan-400' : 'text-slate-500'} />
                      <span>Facility Sites</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentTab('inventory')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentTab === 'inventory'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package size={17} className={currentTab === 'inventory' ? 'text-cyan-400' : 'text-slate-500'} />
                      <span>Inventory Parts</span>
                    </div>
                  </button>

                  {hasRole('ADMIN') && (
                    <button
                      onClick={() => setCurrentTab('users')}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentTab === 'users'
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <UserCog size={17} className={currentTab === 'users' ? 'text-cyan-400' : 'text-slate-500'} />
                        <span>User Directory</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {isTechnician && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
                Field Tasks
              </div>
              <button
                onClick={() => setCurrentTab('field')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'field'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Wrench size={17} className={currentTab === 'field' ? 'text-cyan-400' : 'text-slate-500'} />
                <span>My Assigned Jobs</span>
              </button>
            </div>
          )}

          {isCustomer && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
                Customer Services
              </div>
              <button
                onClick={() => setCurrentTab('portal')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'portal'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Users size={17} className={currentTab === 'portal' ? 'text-cyan-400' : 'text-slate-500'} />
                <span>Support Tickets</span>
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3.5 bg-slate-950/80 rounded-xl border border-white/5 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-slate-200 text-[11px]">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>KEYSTONE Enterprise</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-900">
          <span>v2.0 RBAC Active</span>
          <span className="text-emerald-400/90 font-sans font-semibold">99.9% Uptime</span>
        </div>
      </div>
    </aside>
  );
};

