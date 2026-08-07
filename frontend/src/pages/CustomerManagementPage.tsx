import React, { useEffect, useState } from 'react';
import { Customer, Site } from '../types';
import { api } from '../services/api';
import { Building2, Plus, Mail, Phone, MapPin, X } from 'lucide-react';

export const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'customer' | 'site'>('customer');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [contactPerson, setContactPerson] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cList, sList] = await Promise.all([
        api.getCustomers(),
        api.getSites(),
      ]);
      setCustomers(cList);
      setSites(sList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.createCustomer({
        name,
        code,
        contactEmail: email,
        contactPhone: phone,
        address,
      });
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) return;
    setFormError(null);
    try {
      await api.createSite({
        name,
        address,
        customerId: Number(selectedCustomerId),
        contactPerson,
      });
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const resetForm = () => {
    setName('');
    setCode('');
    setEmail('');
    setPhone('');
    setAddress('');
    setSelectedCustomerId('');
    setContactPerson('');
    setFormError(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Building2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Customers & Facility Sites</h1>
              <p className="text-xs text-slate-400">Manage client organizations, billing contacts, and building locations</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setModalType('customer'); resetForm(); setShowModal(true); }}
            className="ks-btn-primary h-10 text-xs px-4 w-auto"
          >
            <Plus size={16} /> Add Customer
          </button>
          <button
            onClick={() => { setModalType('site'); resetForm(); setShowModal(true); }}
            className="ks-btn-secondary h-10 text-xs px-4"
          >
            <Plus size={16} /> Add Site
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customers List */}
        <div className="glass-card p-6 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-white">Client Organizations</h2>
            <span className="text-xs font-bold text-blue-400 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              {customers.length} Accounts
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {customers.map(c => (
              <div key={c.id} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">{c.name}</h3>
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-500/30">
                    {c.code}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1.5 pt-1">
                  <div className="flex items-center gap-2"><Mail size={14} className="text-slate-500" /> <span>{c.contactEmail}</span></div>
                  {c.contactPhone && <div className="flex items-center gap-2"><Phone size={14} className="text-slate-500" /> <span>{c.contactPhone}</span></div>}
                  {c.address && <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-500" /> <span>{c.address}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sites List */}
        <div className="glass-card p-6 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-white">Building Sites</h2>
            <span className="text-xs font-bold text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              {sites.length} Locations
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {sites.map(s => (
              <div key={s.id} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">{s.name}</h3>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">{s.customerName}</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1.5 pt-1">
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-500" /> <span>{s.address}</span></div>
                  {s.contactPerson && <div className="text-slate-400">On-site Contact: <strong className="text-slate-200">{s.contactPerson}</strong></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card w-full max-w-lg p-6 space-y-5 border border-slate-700/80 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                {modalType === 'customer' ? 'Create New Customer Organization' : 'Create New Site Location'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-4 bg-red-950/80 border border-red-500/50 text-red-300 text-xs rounded-xl">
                {formError}
              </div>
            )}

            <form onSubmit={modalType === 'customer' ? handleCreateCustomer : handleCreateSite} className="space-y-4 text-xs">
              {modalType === 'customer' ? (
                <>
                  <div>
                    <label className="ks-label">Company Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="ks-input-plain" required />
                  </div>
                  <div>
                    <label className="ks-label">Unique Code (e.g. CUST-ACME) *</label>
                    <input type="text" value={code} onChange={e => setCode(e.target.value)} className="ks-input-plain" required />
                  </div>
                  <div>
                    <label className="ks-label">Contact Email *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="ks-input-plain" required />
                  </div>
                  <div>
                    <label className="ks-label">Contact Phone</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="ks-input-plain" />
                  </div>
                  <div>
                    <label className="ks-label">HQ Address</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="ks-input-plain" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="ks-label">Belongs to Customer Organization *</label>
                    <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(Number(e.target.value))} className="ks-select" required>
                      <option value="">Select Customer...</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ks-label">Site/Building Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="ks-input-plain" required />
                  </div>
                  <div>
                    <label className="ks-label">Full Address *</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="ks-input-plain" required />
                  </div>
                  <div>
                    <label className="ks-label">On-Site Contact Person</label>
                    <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="ks-input-plain" />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="ks-btn-secondary">Cancel</button>
                <button type="submit" className="ks-btn-primary w-auto px-6">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
