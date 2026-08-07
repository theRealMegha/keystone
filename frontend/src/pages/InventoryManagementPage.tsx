import React, { useEffect, useState } from 'react';
import { Part } from '../types';
import { api } from '../services/api';
import { Package, Plus, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const InventoryManagementPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [stockQty, setStockQty] = useState<number>(10);
  const [minStockLevel, setMinStockLevel] = useState<number>(5);
  const [formError, setFormError] = useState<string | null>(null);

  // Restock state
  const [restockPartId, setRestockPartId] = useState<number | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);

  const loadParts = async () => {
    setLoading(true);
    try {
      const data = await api.getParts();
      setParts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParts();
  }, []);

  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.createPart({ name, sku, unitCost, stockQty, minStockLevel });
      setShowModal(false);
      setName(''); setSku(''); setUnitCost(0); setStockQty(10);
      loadParts();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleRestock = async (id: number) => {
    try {
      await api.restockPart(id, restockQty);
      setRestockPartId(null);
      loadParts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Package size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Inventory & Spare Parts Control</h1>
              <p className="text-xs text-slate-400">Real-time stock decrementing, reorder thresholds, and unit costs</p>
            </div>
          </div>
        </div>
        {hasRole('ADMIN') && (
          <button onClick={() => setShowModal(true)} className="ks-btn-primary h-10 text-xs px-5 w-auto">
            <Plus size={16} /> Add Inventory Part
          </button>
        )}
      </div>

      <div className="glass-card p-6 border border-slate-800 overflow-x-auto shadow-md">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-3">Part Name</th>
              <th className="py-3.5 px-3">SKU</th>
              <th className="py-3.5 px-3">Unit Cost</th>
              <th className="py-3.5 px-3">Stock Level</th>
              <th className="py-3.5 px-3">Min Threshold</th>
              <th className="py-3.5 px-3">Status</th>
              {hasRole('ADMIN') && <th className="py-3.5 px-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {parts.map(p => {
              const isLow = p.stockQty <= p.minStockLevel;
              return (
                <tr key={p.id} className="border-b border-slate-800/60 text-slate-200 hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-white">{p.name}</td>
                  <td className="py-3.5 px-3 font-mono text-blue-400 font-bold">{p.sku}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">${p.unitCost}</td>
                  <td className="py-3.5 px-3 font-mono font-black text-sm">{p.stockQty}</td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono">{p.minStockLevel}</td>
                  <td className="py-3.5 px-3">
                    {isLow ? (
                      <span className="badge badge-urgent flex items-center gap-1 w-max">
                        <AlertTriangle size={11} /> Low Stock
                      </span>
                    ) : (
                      <span className="badge badge-completed w-max">In Stock</span>
                    )}
                  </td>
                  {hasRole('ADMIN') && (
                    <td className="py-3.5 px-3 text-right">
                      {restockPartId === p.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="1"
                            value={restockQty}
                            onChange={e => setRestockQty(Number(e.target.value))}
                            className="ks-input-plain w-20 py-1 text-xs h-8"
                          />
                          <button onClick={() => handleRestock(p.id)} className="ks-btn-primary h-8 text-xs px-3 w-auto">Confirm</button>
                          <button onClick={() => setRestockPartId(null)} className="ks-btn-secondary h-8 text-xs px-3">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setRestockPartId(p.id)} className="ks-btn-secondary h-8 text-xs px-3">
                          Restock
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card w-full max-w-lg p-6 space-y-5 border border-slate-700/80 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Add Spare Part to Inventory</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            {formError && <div className="p-4 bg-red-950/80 border border-red-500/50 text-red-300 text-xs rounded-xl">{formError}</div>}
            
            <form onSubmit={handleCreatePart} className="space-y-4 text-xs">
              <div>
                <label className="ks-label">Part Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="ks-input-plain" required />
              </div>
              <div>
                <label className="ks-label">SKU Code *</label>
                <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="ks-input-plain" required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="ks-label">Unit Cost ($)</label>
                  <input type="number" step="0.01" value={unitCost} onChange={e => setUnitCost(Number(e.target.value))} className="ks-input-plain" required />
                </div>
                <div>
                  <label className="ks-label">Initial Stock</label>
                  <input type="number" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} className="ks-input-plain" required />
                </div>
                <div>
                  <label className="ks-label">Min Threshold</label>
                  <input type="number" value={minStockLevel} onChange={e => setMinStockLevel(Number(e.target.value))} className="ks-input-plain" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="ks-btn-secondary">Cancel</button>
                <button type="submit" className="ks-btn-primary w-auto px-6">Save Part</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
