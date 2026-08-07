import React, { useEffect, useState } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';
import { UserCog, ShieldCheck, Mail, Phone, Calendar, RefreshCw } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    api.getAllUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <UserCog size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Platform User Directory</h1>
              <p className="text-xs text-slate-400">View users across all four RBAC roles: Admin, Dispatcher, Technician, Customer</p>
            </div>
          </div>
        </div>
        <button onClick={loadUsers} className="ks-btn-secondary text-xs h-10 px-4">
          <RefreshCw size={14} className={loading ? 'animate-spin text-purple-400' : 'text-purple-400'} /> Refresh Directory
        </button>
      </div>

      <div className="glass-card p-6 border border-slate-800 overflow-x-auto shadow-md">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-3">User ID</th>
              <th className="py-3.5 px-3">Full Name</th>
              <th className="py-3.5 px-3">Email Address</th>
              <th className="py-3.5 px-3">Assigned Role</th>
              <th className="py-3.5 px-3">Phone</th>
              <th className="py-3.5 px-3">Account Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-slate-800/60 text-slate-200 hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-3 font-mono text-slate-500 font-bold">#{u.id}</td>
                <td className="py-3.5 px-3 font-bold text-white">{u.fullName}</td>
                <td className="py-3.5 px-3 font-mono text-blue-400 font-bold">{u.email}</td>
                <td className="py-3.5 px-3">
                  <span className={`badge ${
                    u.role === 'ADMIN' ? 'badge-urgent' :
                    u.role === 'DISPATCHER' ? 'badge-assigned' :
                    u.role === 'TECHNICIAN' ? 'badge-in-progress' : 'badge-new'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-400">{u.phone || 'N/A'}</td>
                <td className="py-3.5 px-3">
                  <span className="badge badge-completed">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
