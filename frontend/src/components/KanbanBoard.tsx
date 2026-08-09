import React, { useState } from 'react';
import { WorkOrder, WorkOrderStatus, Priority } from '../types';
import { Clock, User, AlertTriangle, Building, ArrowRight, Search, Filter, LayoutGrid, List, Kanban, CheckCircle2 } from 'lucide-react';

interface KanbanBoardProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onUpdateStatus?: (id: number, newStatus: WorkOrderStatus) => void;
}

type ViewMode = 'cards' | 'list' | 'kanban';

const STATUS_OPTIONS: { status: string; label: string; dot: string }[] = [
  { status: 'ALL', label: 'All Statuses', dot: 'bg-slate-400' },
  { status: 'NEW', label: 'New', dot: 'bg-cyan-400' },
  { status: 'ASSIGNED', label: 'Assigned', dot: 'bg-purple-400' },
  { status: 'IN_PROGRESS', label: 'In Progress', dot: 'bg-amber-400' },
  { status: 'ON_HOLD', label: 'On Hold', dot: 'bg-orange-400' },
  { status: 'COMPLETED', label: 'Completed', dot: 'bg-emerald-400' },
  { status: 'CLOSED', label: 'Closed', dot: 'bg-slate-500' },
];

const COLUMNS: { status: WorkOrderStatus; title: string; color: string; dot: string }[] = [
  { status: 'NEW', title: 'New Requests', color: 'border-cyan-500/60', dot: 'bg-cyan-400' },
  { status: 'ASSIGNED', title: 'Assigned', color: 'border-purple-500/60', dot: 'bg-purple-400' },
  { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-amber-500/60', dot: 'bg-amber-400' },
  { status: 'ON_HOLD', title: 'On Hold', color: 'border-orange-500/60', dot: 'bg-orange-400' },
  { status: 'COMPLETED', title: 'Completed', color: 'border-emerald-500/60', dot: 'bg-emerald-400' },
  { status: 'CLOSED', title: 'Closed', color: 'border-slate-600/60', dot: 'bg-slate-400' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ workOrders, onSelectWorkOrder }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOrders = workOrders.filter(wo => {
    const matchesStatus = filterStatus === 'ALL' || wo.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || wo.priority === filterPriority;
    const matchesSearch =
      wo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wo.customerName && wo.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wo.assignedToName && wo.assignedToName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'NEW': return 'badge-new';
      case 'ASSIGNED': return 'badge-assigned';
      case 'IN_PROGRESS': return 'badge-in-progress';
      case 'ON_HOLD': return 'badge-on-hold';
      case 'COMPLETED': return 'badge-completed';
      case 'CLOSED': return 'badge-closed';
      default: return 'badge-new';
    }
  };

  return (
    <div className="space-y-5">
      {/* SaaS Toolbar: Search, Filters & View Toggle */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-3.5 shadow-inner">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3.5">
          {/* Search Box */}
          <div className="w-full lg:w-96">
            <div className="ks-input-group">
              <span className="ks-input-icon">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search code, title, customer, tech..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="ks-input text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Priority Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Priority:</span>
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="ks-select text-xs w-36"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low Tier</option>
                <option value="MEDIUM">Medium Tier</option>
                <option value="HIGH">High Tier</option>
                <option value="URGENT">Urgent SLA</option>
              </select>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Cards</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="List View"
              >
                <List size={15} />
                <span className="hidden sm:inline">List Table</span>
              </button>

              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Kanban Board View"
              >
                <Kanban size={15} />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 border-t border-white/5">
          {STATUS_OPTIONS.map(opt => {
            const count = opt.status === 'ALL'
              ? workOrders.length
              : workOrders.filter(w => w.status === opt.status).length;

            const isActive = filterStatus === opt.status;

            return (
              <button
                key={opt.status}
                onClick={() => setFilterStatus(opt.status)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`}></span>
                <span>{opt.label}</span>
                <span className="font-mono text-[10px] opacity-75 bg-slate-800/80 px-1.5 py-0.2 rounded-full border border-slate-700">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: Card Grid View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.length === 0 ? (
            <div className="col-span-full glass-card p-12 text-center text-slate-500 text-xs italic font-mono space-y-2 border border-white/5">
              <CheckCircle2 className="mx-auto text-slate-600" size={36} />
              <div>No work orders matching current filters</div>
            </div>
          ) : (
            filteredOrders.map(wo => (
              <div
                key={wo.id}
                onClick={() => onSelectWorkOrder(wo)}
                className={`glass-card p-4.5 rounded-2xl border hover:border-cyan-500/50 cursor-pointer transition-all hover:translate-y-[-2px] space-y-3 relative shadow-lg ${
                  wo.slaBreached ? 'border-red-500/50 bg-red-950/20' : 'border-white/10'
                }`}
              >
                {wo.slaBreached && (
                  <div className="flex items-center gap-1 text-[9px] font-extrabold text-red-400 bg-red-950/80 px-2 py-0.5 rounded-md border border-red-500/40 w-max tracking-wide">
                    <AlertTriangle size={11} />
                    <span>SLA BREACHED</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {wo.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${getStatusBadgeClass(wo.status)}`}>
                      {wo.status.replace('_', ' ')}
                    </span>
                    <span className={`badge badge-${wo.priority.toLowerCase()}`}>
                      {wo.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-100 line-clamp-2 leading-snug">
                    {wo.title}
                  </h4>
                  {wo.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {wo.description}
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-2 truncate">
                    <Building size={13} className="text-slate-500 shrink-0" />
                    <span className="truncate font-semibold text-slate-300">{wo.customerName || 'Customer'}</span>
                    {wo.siteName && <span className="text-slate-500 text-[11px] truncate">({wo.siteName})</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate text-purple-300 font-medium">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] border border-purple-500/30 shrink-0">
                        {wo.assignedToName ? wo.assignedToName.charAt(0) : '?'}
                      </div>
                      <span className="truncate">{wo.assignedToName || 'Unassigned'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Clock size={12} className="text-slate-500" />
                      <span>{wo.slaDueAt ? new Date(wo.slaDueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No SLA'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[11px]">
                  <span className="text-emerald-400 font-mono font-bold">₹{wo.totalPartsCost} parts • {wo.totalLabourMinutes}m labor</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-0.5 hover:underline">
                    Details <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW MODE 2: SaaS High-Density Table List View */}
      {viewMode === 'list' && (
        <div className="glass-card border border-white/10 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="ks-table">
              <thead>
                <tr>
                  <th>Ticket Code</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Title & Customer</th>
                  <th>Assigned Tech</th>
                  <th>SLA Due</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500 text-xs italic font-mono">
                      No work orders matching current filters
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(wo => (
                    <tr key={wo.id} onClick={() => onSelectWorkOrder(wo)} className="cursor-pointer">
                      <td>
                        <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {wo.code}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(wo.status)}`}>
                          {wo.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${wo.priority.toLowerCase()}`}>
                          {wo.priority}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="font-bold text-white leading-snug flex items-center gap-2">
                            <span>{wo.title}</span>
                            {wo.slaBreached && (
                              <span className="text-[9px] font-black text-red-400 bg-red-950/80 px-1.5 py-0.2 rounded border border-red-500/30">
                                BREACHED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Building size={12} className="text-slate-500" />
                            <span>{wo.customerName}</span>
                            {wo.siteName && <span className="text-slate-500">• {wo.siteName}</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-purple-300 font-medium">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] border border-purple-500/30">
                            {wo.assignedToName ? wo.assignedToName.charAt(0) : '?'}
                          </div>
                          <span className="truncate">{wo.assignedToName || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-slate-400">
                        {wo.slaDueAt ? new Date(wo.slaDueAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                      </td>
                      <td className="text-right">
                        <button className="ks-btn-secondary h-8 text-xs px-3">
                          View Ticket
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: Classic Kanban Columns View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {COLUMNS.map(col => {
            const colOrders = filteredOrders.filter(w => w.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-[#090d19]/80 rounded-2xl p-3 border border-white/5 flex flex-col h-[700px] shadow-sm"
              >
                <div className={`flex items-center justify-between pb-3 border-b-2 ${col.color} mb-3 px-1.5`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`}></span>
                    <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-200">{col.title}</h3>
                  </div>
                  <span className="bg-slate-900 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-slate-800">
                    {colOrders.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {colOrders.length === 0 ? (
                    <div className="text-center py-12 text-slate-600 text-xs italic font-mono">No work orders</div>
                  ) : (
                    colOrders.map(wo => (
                      <div
                        key={wo.id}
                        onClick={() => onSelectWorkOrder(wo)}
                        className={`glass-card p-3.5 rounded-xl border hover:border-cyan-500/50 cursor-pointer transition-all hover:translate-y-[-2px] space-y-2.5 relative ${
                          wo.slaBreached ? 'border-red-500/50 bg-red-950/20' : 'border-white/10'
                        }`}
                      >
                        {wo.slaBreached && (
                          <div className="flex items-center gap-1 text-[9px] font-extrabold text-red-400 bg-red-950/80 px-2 py-0.5 rounded-md border border-red-500/40 w-max tracking-wide">
                            <AlertTriangle size={11} />
                            <span>SLA BREACHED</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-black text-cyan-400">{wo.code}</span>
                          <span className={`badge badge-${wo.priority.toLowerCase()}`}>{wo.priority}</span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-100 line-clamp-2 leading-snug">
                          {wo.title}
                        </h4>

                        <div className="text-[11px] text-slate-400 space-y-1 pt-0.5">
                          <div className="flex items-center gap-1.5 truncate">
                            <Building size={12} className="text-slate-500 shrink-0" />
                            <span className="truncate">{wo.customerName || 'Customer'}</span>
                          </div>
                          {wo.assignedToName && (
                            <div className="flex items-center gap-1.5 truncate text-purple-300 font-medium">
                              <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[9px] border border-purple-500/30">
                                {wo.assignedToName.charAt(0)}
                              </div>
                              <span className="truncate">{wo.assignedToName}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock size={11} className="text-slate-500" />
                            <span>{wo.slaDueAt ? new Date(wo.slaDueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No SLA'}</span>
                          </div>
                          <span className="text-cyan-400 font-semibold flex items-center gap-0.5 hover:underline">
                            View <ArrowRight size={10} />
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
      )}
    </div>
  );
};


