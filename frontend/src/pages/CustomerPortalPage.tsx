import React, { useEffect, useState } from 'react';
import { WorkOrder } from '../types';
import { api } from '../services/api';
import { Users, PlusCircle, Building, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';

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
    <div className="space-y-7 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Portal</h1>
              <p className="text-xs text-slate-500">Log facility maintenance tickets and track real-time resolution status</p>
            </div>
          </div>
        </div>
        <button onClick={onOpenCreateModal} className="ks-btn-primary h-9 text-xs px-4">
          <PlusCircle size={15} /> Request Service Ticket
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 text-xs flex items-center justify-center gap-2 font-mono">
          <RefreshCw className="animate-spin text-sky-600" size={18} />
          <span>Fetching your organization's service requests...</span>
        </div>
      ) : customerOrders.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 space-y-4 border border-slate-200 bg-white shadow-xs">
          <CheckCircle2 className="mx-auto text-sky-600" size={48} />
          <h3 className="font-bold text-lg text-slate-900">No Active Requests</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">Need facility maintenance or technician support? Click the button above to log a new service ticket.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {customerOrders.map(wo => (
            <div
              key={wo.id}
              onClick={() => onSelectWorkOrder(wo)}
              className="glass-card p-5 rounded-2xl border border-slate-200 hover:border-sky-400 cursor-pointer transition-all space-y-3.5 shadow-xs bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-black text-sky-700">{wo.code}</span>
                <span className={`badge badge-${wo.status.toLowerCase().replace('_', '-')}`}>
                  {wo.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{wo.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{wo.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Building size={14} className="text-slate-400" />
                  <span className="font-semibold text-slate-700">{wo.siteName}</span>
                </div>
                <div className="flex items-center gap-1 text-sky-600 font-bold hover:underline">
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
