import React, { useState, useEffect } from 'react';
import { WorkOrder, WorkOrderStatus, Part, User } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Clock, AlertTriangle, User as UserIcon, Building, Package, Wrench, FileText, CheckCircle2, History, Plus } from 'lucide-react';

interface WorkOrderDetailModalProps {
  workOrder: WorkOrder | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const WorkOrderDetailModal: React.FC<WorkOrderDetailModalProps> = ({ workOrder, onClose, onRefresh }) => {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'parts' | 'time'>('details');

  const [history, setHistory] = useState<any[]>([]);
  const [partUsages, setPartUsages] = useState<any[]>([]);
  const [timeLogs, setTimeLogs] = useState<any[]>([]);
  const [availableParts, setAvailableParts] = useState<Part[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);

  // Form states
  const [statusNote, setStatusNote] = useState('');
  const [selectedPartId, setSelectedPartId] = useState<number | ''>('');
  const [partQty, setPartQty] = useState<number>(1);
  const [timeMinutes, setTimeMinutes] = useState<number>(30);
  const [timeNote, setTimeNote] = useState('');
  const [assignTechId, setAssignTechId] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (workOrder) {
      loadData();
      if (hasRole('ADMIN', 'DISPATCHER')) {
        api.getTechnicians().then(setTechnicians).catch(console.error);
      }
      api.getParts().then(setAvailableParts).catch(console.error);
    }
  }, [workOrder]);

  const loadData = async () => {
    if (!workOrder) return;
    try {
      const [h, p, t] = await Promise.all([
        api.getAuditHistory(workOrder.id),
        api.getPartUsages(workOrder.id),
        api.getTimeLogs(workOrder.id),
      ]);
      setHistory(h);
      setPartUsages(p);
      setTimeLogs(t);
    } catch (err) {
      console.error(err);
    }
  };

  if (!workOrder) return null;

  const handleStatusChange = async (newStatus: WorkOrderStatus) => {
    setLoading(true);
    setError(null);
    try {
      await api.updateStatus(workOrder.id, newStatus, statusNote || `Status changed to ${newStatus}`);
      setStatusNote('');
      setSuccessMsg(`Status updated to ${newStatus}`);
      loadData();
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!assignTechId) return;
    setLoading(true);
    setError(null);
    try {
      await api.assignWorkOrder(workOrder.id, Number(assignTechId));
      setSuccessMsg('Technician assigned successfully');
      loadData();
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartId || partQty <= 0) return;
    setLoading(true);
    setError(null);
    try {
      await api.logPartUsage(workOrder.id, Number(selectedPartId), partQty);
      setSuccessMsg('Part logged and inventory decremented successfully');
      setSelectedPartId('');
      setPartQty(1);
      loadData();
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeMinutes <= 0) return;
    setLoading(true);
    setError(null);
    try {
      await api.logTime(workOrder.id, timeMinutes, timeNote);
      setSuccessMsg('Labor time logged successfully');
      setTimeMinutes(30);
      setTimeNote('');
      loadData();
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card w-full max-w-4xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto border border-slate-700/80 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-black text-blue-400">{workOrder.code}</span>
              <span className={`badge badge-${workOrder.status.toLowerCase().replace('_', '-')}`}>
                {workOrder.status}
              </span>
              <span className={`badge badge-${workOrder.priority.toLowerCase()}`}>
                {workOrder.priority}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{workOrder.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Banners */}
        {error && (
          <div className="p-4 bg-red-950/80 border border-red-500/50 text-red-300 text-xs rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 font-bold ml-2">✕</button>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'details' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={16} /> Ticket Details
          </button>

          <button
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'parts' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package size={16} /> Parts & Usage ({partUsages.length})
          </button>

          <button
            onClick={() => setActiveTab('time')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'time' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock size={16} /> Time Logs ({timeLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'history' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History size={16} /> Audit History ({history.length})
          </button>
        </div>

        {/* Tab 1: Ticket Details & Action Panel */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer & Site Info</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Building size={16} className="text-blue-400" />
                      <span className="font-bold">{workOrder.customerName || 'Customer Organization'}</span>
                    </div>
                    <div className="text-slate-400 pl-6">{workOrder.siteName}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technician Assignment</h4>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-200">
                      <UserIcon size={16} className="text-purple-400" />
                      <span className="font-semibold">{workOrder.assignedToName || 'Unassigned'}</span>
                    </div>
                    {hasRole('ADMIN', 'DISPATCHER') && (
                      <div className="flex items-center gap-2">
                        <select
                          value={assignTechId}
                          onChange={e => setAssignTechId(e.target.value ? Number(e.target.value) : '')}
                          className="ks-select py-1 text-xs w-auto h-9"
                        >
                          <option value="">Reassign...</option>
                          {technicians.map(t => (
                            <option key={t.id} value={t.id}>{t.fullName}</option>
                          ))}
                        </select>
                        <button onClick={handleAssign} disabled={!assignTechId || loading} className="ks-btn-primary h-9 text-xs px-3">
                          Assign
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SLA Status</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Target SLA:</span>
                      <span className="font-mono text-slate-200 font-bold">{workOrder.priority} Tier</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Due By:</span>
                      <span className="font-mono text-slate-200">{workOrder.slaDueAt ? new Date(workOrder.slaDueAt).toLocaleString() : 'N/A'}</span>
                    </div>
                    {workOrder.slaBreached && (
                      <div className="p-2.5 bg-red-950/60 border border-red-500/50 text-red-300 text-xs rounded-xl flex items-center gap-2 font-bold">
                        <AlertTriangle size={16} /> SLA BREACHED
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Job Status</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Status note or completion comments..."
                      value={statusNote}
                      onChange={e => setStatusNote(e.target.value)}
                      className="ks-input-plain text-xs h-9"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button onClick={() => handleStatusChange('IN_PROGRESS')} disabled={loading} className="ks-btn-secondary h-9 text-xs">
                        In Progress
                      </button>
                      <button onClick={() => handleStatusChange('ON_HOLD')} disabled={loading} className="ks-btn-secondary h-9 text-xs">
                        On Hold
                      </button>
                      <button onClick={() => handleStatusChange('COMPLETED')} disabled={loading} className="ks-btn-primary h-9 text-xs">
                        Complete Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{workOrder.description || 'No description provided.'}</p>
            </div>
          </div>
        )}

        {/* Tab 2: Parts Log */}
        {activeTab === 'parts' && (
          <div className="space-y-6">
            <form onSubmit={handleLogPart} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Plus size={16} className="text-blue-400" /> Log Part Usage
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={selectedPartId}
                  onChange={e => setSelectedPartId(e.target.value ? Number(e.target.value) : '')}
                  className="ks-select text-xs h-10 col-span-2"
                  required
                >
                  <option value="">Select Inventory Part...</option>
                  {availableParts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku}) — Stock: {p.stockQty}</option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={partQty}
                  onChange={e => setPartQty(Number(e.target.value))}
                  className="ks-input-plain text-xs h-10"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="ks-btn-primary h-10 text-xs">
                Log Part & Decrement Stock
              </button>
            </form>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parts Used on Ticket</h4>
              {partUsages.length === 0 ? (
                <div className="text-xs text-slate-500 italic text-center py-6">No parts logged on this work order yet.</div>
              ) : (
                <div className="space-y-2">
                  {partUsages.map(pu => (
                    <div key={pu.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{pu.partName || `Part #${pu.partId}`}</div>
                        <div className="text-[10px] text-slate-400">Logged by {pu.loggedByName || 'Technician'}</div>
                      </div>
                      <div className="font-mono font-bold text-blue-400">{pu.quantity} unit(s)</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Time Logs */}
        {activeTab === 'time' && (
          <div className="space-y-6">
            <form onSubmit={handleLogTime} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-blue-400" /> Log Labor Time
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="number"
                  min="1 border"
                  placeholder="Minutes spent..."
                  value={timeMinutes}
                  onChange={e => setTimeMinutes(Number(e.target.value))}
                  className="ks-input-plain text-xs h-10"
                  required
                />
                <input
                  type="text"
                  placeholder="Notes on work performed..."
                  value={timeNote}
                  onChange={e => setTimeNote(e.target.value)}
                  className="ks-input-plain text-xs h-10 col-span-2"
                />
              </div>
              <button type="submit" disabled={loading} className="ks-btn-primary h-10 text-xs">
                Log Labor Minutes
              </button>
            </form>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Labor Logs</h4>
              {timeLogs.length === 0 ? (
                <div className="text-xs text-slate-500 italic text-center py-6">No labor time logged yet.</div>
              ) : (
                <div className="space-y-2">
                  {timeLogs.map(tl => (
                    <div key={tl.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{tl.note || 'Work performed'}</div>
                        <div className="text-[10px] text-slate-400">By {tl.userFullName}</div>
                      </div>
                      <div className="font-mono font-bold text-indigo-400">{tl.minutesSpent} mins</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Audit History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activity Audit Timeline</h4>
            {history.length === 0 ? (
              <div className="text-xs text-slate-500 italic text-center py-6">No history records found.</div>
            ) : (
              <div className="space-y-2.5">
                {history.map(h => (
                  <div key={h.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{h.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(h.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{h.details}</p>
                    <div className="text-[10px] text-blue-400">By: {h.performedByName || 'System'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
