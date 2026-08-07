import React, { useEffect, useState } from 'react';
import { WorkOrder } from '../types';
import { api } from '../services/api';
import { Wrench, Clock, AlertTriangle, Building, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';

interface TechnicianFieldPageProps {
  onSelectWorkOrder: (wo: WorkOrder) => void;
}

export const TechnicianFieldPage: React.FC<TechnicianFieldPageProps> = ({ onSelectWorkOrder }) => {
  const [myOrders, setMyOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMyOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getMyWorkOrders();
      setMyOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyOrders();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Wrench size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Technician Field Workspace</h1>
              <p className="text-xs text-slate-400">Mobile work order queue, SLA countdowns, and field logging</p>
            </div>
          </div>
        </div>
        <button onClick={loadMyOrders} className="ks-btn-secondary text-xs h-10 px-4">
          <RefreshCw size={14} className={loading ? 'animate-spin text-blue-400' : 'text-blue-400'} /> Refresh Jobs
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="animate-spin text-blue-500" size={18} />
          <span>Fetching assigned field work orders...</span>
        </div>
      ) : myOrders.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400 space-y-3">
          <CheckCircle2 className="mx-auto text-emerald-400" size={48} />
          <h3 className="font-bold text-lg text-white">All Caught Up!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">There are currently no active field work orders assigned to your account queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(wo => (
            <div
              key={wo.id}
              onClick={() => onSelectWorkOrder(wo)}
              className={`glass-card p-5 rounded-2xl border hover:border-blue-500/60 cursor-pointer transition-all space-y-3 shadow-md ${
                wo.slaBreached ? 'border-red-500/60 bg-red-950/30' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-black text-blue-400">{wo.code}</span>
                  <span className={`badge badge-${wo.status.toLowerCase().replace('_', '-')}`}>
                    {wo.status}
                  </span>
                  <span className={`badge badge-${wo.priority.toLowerCase()}`}>
                    {wo.priority}
                  </span>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{wo.title}</h3>
                {wo.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{wo.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-slate-300">
                <div className="flex items-center gap-2">
                  <Building size={15} className="text-slate-500 shrink-0" />
                  <span className="truncate font-semibold">{wo.siteName || wo.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-slate-500 shrink-0" />
                  <span>Due: {wo.slaDueAt ? new Date(wo.slaDueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <span>Parts: ${wo.totalPartsCost}</span> • <span>{wo.totalLabourMinutes} mins labor</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
