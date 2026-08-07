import React, { useEffect, useState } from 'react';
import { DashboardMetrics, WorkOrder } from '../types';
import { api } from '../services/api';
import { KanbanBoard } from '../components/KanbanBoard';
import { LayoutDashboard, AlertTriangle, ShieldCheck, Package, RefreshCw, Activity, ArrowUpRight } from 'lucide-react';

interface DashboardPageProps {
  onSelectWorkOrder: (wo: WorkOrder) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectWorkOrder }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, wos] = await Promise.all([
        api.getDashboardMetrics(),
        api.getWorkOrders(),
      ]);
      setMetrics(m);
      setWorkOrders(wos);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !metrics) {
    return (
      <div className="p-12 flex items-center justify-center text-slate-400 text-sm">
        <RefreshCw className="animate-spin mr-3 text-blue-500" size={22} /> Initializing operational metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Operations Command Dashboard</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Live Sync</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time SLA tracking, dispatch metrics, and operational health</p>
        </div>
        <button onClick={loadData} className="ks-btn-secondary text-xs h-10 px-4">
          <RefreshCw size={14} className={loading ? 'animate-spin text-blue-400' : 'text-blue-400'} /> Refresh Metrics
        </button>
      </div>

      {/* KPI Cards Grid */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-5 border border-slate-800 relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Work Orders</span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <LayoutDashboard size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-3">{metrics.totalWorkOrders}</div>
            <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
              <span><strong className="text-blue-400">{metrics.newWorkOrders}</strong> New</span>
              <span><strong className="text-purple-400">{metrics.assignedWorkOrders}</strong> Assigned</span>
            </div>
          </div>

          <div className="glass-card p-5 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SLA Compliance</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-3">{metrics.slaComplianceRate}%</div>
            <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
              <span>Target: 95.0%</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">Compliant <ArrowUpRight size={12} /></span>
            </div>
          </div>

          <div className="glass-card p-5 border border-slate-800 relative overflow-hidden group hover:border-red-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SLA Breached Jobs</span>
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className={`text-3xl font-black mt-3 ${metrics.slaBreachedCount > 0 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
              {metrics.slaBreachedCount}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              {metrics.slaBreachedCount > 0 ? '⚠️ Manager Intervention Required' : '✅ Zero Active SLA Breaches'}
            </div>
          </div>

          <div className="glass-card p-5 border border-slate-800 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Parts</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Package size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-400 mt-3">{metrics.lowStockPartsCount}</div>
            <div className="text-xs text-slate-400 mt-2">
              Parts below minimum reorder threshold
            </div>
          </div>
        </div>
      )}

      {/* Main Board View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <span>Work Order Dispatch Kanban</span>
            <span className="text-xs font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
              {workOrders.length} Tickets
            </span>
          </h2>
        </div>
        <KanbanBoard workOrders={workOrders} onSelectWorkOrder={onSelectWorkOrder} />
      </div>
    </div>
  );
};
