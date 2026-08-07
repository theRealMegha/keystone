import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Kanban, Wrench, Users, Package, Building2, UserCog, PlusCircle, ShieldCheck } from 'lucide-react';

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
    <aside className="w-64 bg-slate-950/95 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)]">
      <div className="space-y-6">
        {onOpenCreateModal && (isManagerOrDispatcher || isCustomer) && (
          <button
            onClick={onOpenCreateModal}
            className="ks-btn-primary flex items-center justify-center gap-2 py-3 shadow-lg shadow-blue-600/25"
          >
            <PlusCircle size={18} />
            <span>New Work Order</span>
          </button>
        )}

        <nav className="space-y-1.5">
          {isManagerOrDispatcher && (
            <>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentTab('kanban')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'kanban'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Kanban size={18} />
                <span>Kanban Board</span>
              </button>

              <button
                onClick={() => setCurrentTab('customers')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'customers'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Building2 size={18} />
                <span>Customers & Sites</span>
              </button>

              <button
                onClick={() => setCurrentTab('inventory')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'inventory'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Package size={18} />
                <span>Inventory & Parts</span>
              </button>

              {hasRole('ADMIN') && (
                <button
                  onClick={() => setCurrentTab('users')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentTab === 'users'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <UserCog size={18} />
                  <span>User Management</span>
                </button>
              )}
            </>
          )}

          {isTechnician && (
            <button
              onClick={() => setCurrentTab('field')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'field'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Wrench size={18} />
              <span>Technician Field View</span>
            </button>
          )}

          {isCustomer && (
            <button
              onClick={() => setCurrentTab('portal')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === 'portal'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Users size={18} />
              <span>Customer Portal</span>
            </button>
          )}
        </nav>
      </div>

      <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Keystone Enterprise</span>
        </div>
        <div className="text-[11px] text-slate-400">Platform Build v2.0</div>
        <div className="text-[10px] text-slate-500 font-mono">JWT Guard • Multi-Role active</div>
      </div>
    </aside>
  );
};
