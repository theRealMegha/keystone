import React, { useEffect, useState } from 'react';
import { DashboardMetrics, WorkOrder } from '../types';
import { api } from '../services/api';
import { KanbanBoard } from '../components/KanbanBoard';
import { LayoutDashboard, AlertTriangle, ShieldCheck, Package, RefreshCw, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';

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
      <div className="p-16 flex flex-col items-center justify-center text-slate-400 text-xs space-y-3">
        <RefreshCw className="animate-spin text-cyan-400" size={24} />
        <span className="font-mono">Syncing operational dispatch telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-white tracking-tight">Operations Command Dashboard</h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time SLA tracking, dispatch metrics, and field team health</p>
        </div>
        <button onClick={loadData} className="ks-btn-secondary text-xs h-9 px-3.5">
          <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : 'text-cyan-400'} /> Refresh Metrics
        </button>
      </div>

      {/* Modern SaaS Metric Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 border border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Work Orders</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <LayoutDashboard size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-3 tracking-tight">{metrics.totalWorkOrders}</div>
            <div className="text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
              <span><strong className="text-cyan-400 font-bold">{metrics.newWorkOrders}</strong> New</span>
              <span><strong className="text-purple-400 font-bold">{metrics.assignedWorkOrders}</strong> Assigned</span>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SLA Compliance</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-3 tracking-tight">{metrics.slaComplianceRate}%</div>
            <div className="text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px]">Target: 95.0%</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5 text-[11px]">
                Target Met <ArrowUpRight size={13} />
              </span>
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10 relative overflow-hidden group hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SLA Breaches</span>
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className={`text-3xl font-black mt-3 tracking-tight ${metrics.slaBreachedCount > 0 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
              {metrics.slaBreachedCount}
            </div>
            <div className="text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80">
              {metrics.slaBreachedCount > 0 ? '⚠️ Dispatcher Intervention Needed' : '✅ Zero Active SLA Breaches'}
            </div>
          </div>

          <div className="glass-card p-5 border border-white/10 relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Low Stock SKUs</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Package size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-400 mt-3 tracking-tight">{metrics.lowStockPartsCount}</div>
            <div className="text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80">
              Parts below reorder thresholds
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Board Header & Kanban View */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white tracking-tight">Work Order Dispatch Matrix</h2>
            <span className="text-xs font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25">
              {workOrders.length} Total Tickets
            </span>
          </div>
        </div>
        <KanbanBoard workOrders={workOrders} onSelectWorkOrder={onSelectWorkOrder} />
      </div>
    </div>
  );
};

