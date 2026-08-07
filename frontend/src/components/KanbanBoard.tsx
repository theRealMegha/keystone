import React, { useState } from 'react';
import { WorkOrder, WorkOrderStatus, Priority } from '../types';
import { Clock, User, AlertTriangle, Building, ArrowRight, Search, Filter } from 'lucide-react';

interface KanbanBoardProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onUpdateStatus?: (id: number, newStatus: WorkOrderStatus) => void;
}

const COLUMNS: { status: WorkOrderStatus; title: string; color: string }[] = [
  { status: 'NEW', title: 'New Requests', color: 'border-blue-500' },
  { status: 'ASSIGNED', title: 'Assigned', color: 'border-purple-500' },
  { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-yellow-500' },
  { status: 'ON_HOLD', title: 'On Hold', color: 'border-orange-500' },
  { status: 'COMPLETED', title: 'Completed', color: 'border-green-500' },
  { status: 'CLOSED', title: 'Closed', color: 'border-slate-600' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ workOrders, onSelectWorkOrder }) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOrders = workOrders.filter(wo => {
    const matchesPriority = filterPriority === 'ALL' || wo.priority === filterPriority;
    const matchesSearch =
      wo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wo.customerName && wo.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Controls & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-inner">
        <div className="w-full sm:w-80">
          <div className="ks-input-group">
            <span className="ks-input-icon">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Filter code, title, customer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ks-input"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Filter size={14} className="text-blue-400" />
            <span>Priority:</span>
          </div>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="ks-select w-auto"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="URGENT">Urgent SLA</option>
          </select>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const colOrders = filteredOrders.filter(w => w.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-950/70 rounded-2xl p-3.5 border border-slate-800/90 flex flex-col h-[680px] shadow-sm"
            >
              <div className={`flex items-center justify-between pb-3 border-b-2 ${col.color} mb-3 px-1`}>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">{col.title}</h3>
                <span className="bg-slate-800 text-slate-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                  {colOrders.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colOrders.length === 0 ? (
                  <div className="text-center py-12 text-slate-600 text-xs italic">No work orders</div>
                ) : (
                  colOrders.map(wo => (
                    <div
                      key={wo.id}
                      onClick={() => onSelectWorkOrder(wo)}
                      className={`glass-card p-4 rounded-xl border hover:border-blue-500/60 cursor-pointer transition-all hover:translate-y-[-2px] space-y-2.5 relative ${
                        wo.slaBreached ? 'border-red-500/60 bg-red-950/30' : 'border-slate-800'
                      }`}
                    >
                      {wo.slaBreached && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded-md border border-red-500/40 w-max mb-1">
                          <AlertTriangle size={12} />
                          <span>SLA BREACHED</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-blue-400">{wo.code}</span>
                        <span className={`badge badge-${wo.priority.toLowerCase()}`}>{wo.priority}</span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-100 line-clamp-2 leading-snug">
                        {wo.title}
                      </h4>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building size={12} className="text-slate-500 shrink-0" />
                          <span className="truncate">{wo.customerName || 'Customer'}</span>
                        </div>
                        {wo.assignedToName && (
                          <div className="flex items-center gap-1.5 truncate text-purple-300 font-medium">
                            <User size={12} className="text-purple-400 shrink-0" />
                            <span className="truncate">{wo.assignedToName}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{wo.slaDueAt ? new Date(wo.slaDueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No SLA'}</span>
                        </div>
                        <span className="text-blue-400 font-semibold flex items-center gap-0.5 hover:underline">
                          Details <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
