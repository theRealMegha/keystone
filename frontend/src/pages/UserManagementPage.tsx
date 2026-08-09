import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { UserCog, RefreshCw, Shield, UserCheck } from 'lucide-react';

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
    <div className="space-y-7">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <UserCog size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Platform User Directory</h1>
              <p className="text-xs text-slate-400">View users across all RBAC roles: Admin, Dispatcher, Technician, Customer</p>
            </div>
          </div>
        </div>
        <button onClick={loadUsers} className="ks-btn-secondary text-xs h-9 px-3.5">
          <RefreshCw size={14} className={loading ? 'animate-spin text-purple-400' : 'text-purple-400'} /> Refresh Directory
        </button>
      </div>

      {/* Modern SaaS Table */}
      <div className="glass-card border border-white/10 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="ks-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Details</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="font-mono text-slate-500 font-bold">#{u.id}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {u.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white leading-tight">{u.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-cyan-400 font-semibold">{u.email}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'ADMIN' ? 'badge-urgent' :
                      u.role === 'DISPATCHER' ? 'badge-assigned' :
                      u.role === 'TECHNICIAN' ? 'badge-in-progress' : 'badge-new'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-slate-400">{u.phone || '—'}</td>
                  <td>
                    <span className="badge badge-completed flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

