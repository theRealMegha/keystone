import React, { useEffect, useState } from 'react';
import { WorkOrder } from '../types';
import { api } from '../services/api';
import { Users, PlusCircle, Clock, Building, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';

interface CustomerPortalPageProps {
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onOpenCreateModal: () => void;
}

export const CustomerPortalPage: React.FC<CustomerPortalPageProps> = ({ onSelectWorkOrder, onOpenCreateModal }) => {
  const [customerOrders, setCustomerOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomerOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomerWorkOrders();
      setCustomerOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerOrders();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Customer Portal</h1>
              <p className="text-xs text-slate-400">Log facility maintenance tickets and track real-time resolution status</p>
            </div>
          </div>
        </div>
        <button onClick={onOpenCreateModal} className="ks-btn-primary h-10 text-xs px-5 w-auto">
          <PlusCircle size={16} /> Request Service Ticket
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="animate-spin text-blue-500" size={18} />
          <span>Fetching your organization's service requests...</span>
        </div>
      ) : customerOrders.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400 space-y-4">
          <CheckCircle2 className="mx-auto text-blue-400" size={48} />
          <h3 className="font-bold text-lg text-white">No Active Requests</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">Need facility maintenance or technician support? Click the button above to log a new service ticket.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {customerOrders.map(wo => (
            <div
              key={wo.id}
              onClick={() => onSelectWorkOrder(wo)}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-blue-500/60 cursor-pointer transition-all space-y-3.5 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-black text-blue-400">{wo.code}</span>
                <span className={`badge badge-${wo.status.toLowerCase().replace('_', '-')}`}>
                  {wo.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{wo.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{wo.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Building size={14} className="text-slate-500" />
                  <span className="font-semibold">{wo.siteName}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400 font-bold hover:underline">
                  <span>Track Status</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
