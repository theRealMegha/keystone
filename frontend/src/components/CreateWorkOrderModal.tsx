import React, { useState, useEffect } from 'react';
import { Customer, Site, User, Priority } from '../types';
import { api } from '../services/api';
import { X, PlusCircle, AlertTriangle } from 'lucide-react';

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [siteId, setSiteId] = useState<number | ''>('');
  const [assignedToId, setAssignedToId] = useState<number | ''>('');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.getCustomers().then(setCustomers).catch(console.error);
      api.getTechnicians().then(setTechnicians).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (customerId) {
      api.getSitesByCustomer(Number(customerId)).then(setSites).catch(console.error);
    } else {
      setSites([]);
    }
  }, [customerId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !customerId || !siteId) {
      setError('Please fill in all required fields (Title, Customer, Site)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.createWorkOrder({
        title,
        description,
        priority,
        customerId: Number(customerId),
        siteId: Number(siteId),
        assignedToId: assignedToId ? Number(assignedToId) : undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create work order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card w-full max-w-xl p-7 space-y-6 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <PlusCircle size={20} />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Create Work Order</h2>
              <p className="text-xs text-slate-400">Dispatch a new field ticket to technicians</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="ks-label">Work Order Title *</label>
            <input
              type="text"
              placeholder="e.g. HVAC Cooling Malfunction on 3rd Floor"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="ks-input-plain"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="ks-label">Customer Organization *</label>
              <select
                value={customerId}
                onChange={e => {
                  setCustomerId(e.target.value ? Number(e.target.value) : '');
                  setSiteId('');
                }}
                className="ks-select"
                required
              >
                <option value="">Select Customer...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="ks-label">Site Location *</label>
              <select
                value={siteId}
                onChange={e => setSiteId(e.target.value ? Number(e.target.value) : '')}
                className="ks-select"
                disabled={!customerId}
                required
              >
                <option value="">Select Site Location...</option>
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.address}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="ks-label">Priority Tier *</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="ks-select"
              >
                <option value="LOW">Low (72h SLA)</option>
                <option value="MEDIUM">Medium (48h SLA)</option>
                <option value="HIGH">High (24h SLA)</option>
                <option value="URGENT">Urgent (4h SLA)</option>
              </select>
            </div>

            <div>
              <label className="ks-label">Assign Technician</label>
              <select
                value={assignedToId}
                onChange={e => setAssignedToId(e.target.value ? Number(e.target.value) : '')}
                className="ks-select"
              >
                <option value="">Unassigned (New Ticket)</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.fullName}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="ks-label">Description / Work Details</label>
            <textarea
              rows={3}
              placeholder="Provide job context, equipment serial numbers, or symptoms reported..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="ks-textarea"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="ks-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="ks-btn-primary w-auto px-6">
              {loading ? 'Creating Ticket...' : 'Create Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

