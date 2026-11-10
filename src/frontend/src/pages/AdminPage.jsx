import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../api/adminApi';
import { AlertBanner } from '../components/common/AlertBanner';

export const AdminPage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch health
      const healthRes = await adminApi.getHealth();
      if (healthRes.success) setHealth(healthRes.data || healthRes);

      // Fetch users
      const usersRes = await adminApi.getUsers(roleFilter ? { role: roleFilter } : {});
      if (usersRes.success) setUsers(usersRes.data || []);

      // Fetch logs
      const logsRes = await adminApi.getAuditLogs({ limit: 50 });
      if (logsRes.success) setLogs(logsRes.data || []);
    } catch (err) {
      setError('Failed to fetch administrative data. Please ensure admin privileges are active.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter]);

  const handleToggleStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    const actionLabel = newStatus === 'active' ? 'activate' : 'suspend';

    if (!window.confirm(`Are you sure you want to ${actionLabel} account "${targetUser.email}"?`)) {
      return;
    }

    try {
      const res = await adminApi.updateUserStatus(targetUser._id, newStatus);
      if (res.success) {
        setSuccessMsg(`User "${targetUser.email}" is now ${newStatus}.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update account status.');
    }
  };

  return (
    <div className="min-h-screen bg-pale-200 flex flex-col justify-between selection:bg-midnight-900 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-300">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-rose-800">
              <span>System Administration</span>
              <span>•</span>
              <span className="font-mono">Audit & Governance Console</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-midnight-900 mt-1">
              Admin Workspace — {user?.name}
            </h1>
          </div>

          <span className="text-xs px-3.5 py-1.5 rounded-full bg-rose-950 text-rose-100 font-mono font-medium shadow-sm border border-rose-900">
            Access Level: System Administrator
          </span>
        </div>

        {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
        {successMsg && <AlertBanner type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

        {/* Health Diagnostic Cards */}
        {health && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-300 shadow-subtle">
              <span className="text-[10px] font-mono uppercase text-slate-500">API Gateway</span>
              <div className="text-base font-bold text-midnight-900 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{health.status?.toUpperCase() || 'HEALTHY'}</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Express 4.19 / Node.js</span>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-300 shadow-subtle">
              <span className="text-[10px] font-mono uppercase text-slate-500">Database Engine</span>
              <div className="text-base font-bold text-midnight-900 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{health.components?.database?.status?.toUpperCase() || 'CONNECTED'}</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">MongoDB Persistence</span>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-300 shadow-subtle">
              <span className="text-[10px] font-mono uppercase text-slate-500">AI Microservice</span>
              <div className="text-base font-bold text-midnight-900 mt-1 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    health.components?.aiService?.status === 'reachable'
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                ></span>
                <span>{health.components?.aiService?.status?.toUpperCase() || 'STANDBY'}</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">FastAPI / PyMuPDF</span>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-300 shadow-subtle">
              <span className="text-[10px] font-mono uppercase text-slate-500">Security Gateways</span>
              <div className="text-base font-bold text-midnight-900 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>ACTIVE</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">JWT / RBAC Enforced</span>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex gap-2 p-1.5 rounded-xl bg-white border border-slate-300 max-w-sm shadow-sm">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-sans font-semibold transition-all ${
              activeTab === 'users' ? 'bg-midnight-900 text-white shadow-sm' : 'text-slate-600 hover:text-midnight-900'
            }`}
          >
            User Governance ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-sans font-semibold transition-all ${
              activeTab === 'logs' ? 'bg-midnight-900 text-white shadow-sm' : 'text-slate-600 hover:text-midnight-900'
            }`}
          >
            Audit Trail ({logs.length})
          </button>
        </div>

        {/* Tab 1: User Governance Table */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-midnight-900">User Directory</h3>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-midnight-900 focus:outline-none shadow-sm"
              >
                <option value="">All Roles</option>
                <option value="citizen">Citizens</option>
                <option value="lawyer">Lawyers</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            <div className="rounded-2xl bg-white border border-slate-300 overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-pale-200 border-b border-slate-300 text-[11px] font-bold uppercase tracking-wider text-midnight-900">
                      <th className="py-3.5 px-6">Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Account Status</th>
                      <th className="py-3.5 px-6 text-right">Governance Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-pale-100/70 transition-colors">
                        <td className="py-4 px-6 font-semibold text-midnight-900">{u.name}</td>
                        <td className="py-4 px-4 font-mono text-slate-700">{u.email}</td>
                        <td className="py-4 px-4 uppercase font-mono text-[10px]">
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              u.role === 'admin'
                                ? 'bg-rose-100 text-rose-800'
                                : u.role === 'lawyer'
                                ? 'bg-midnight-900 text-white'
                                : 'bg-pale-200 text-slate-800 border border-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {u.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {u._id !== user?.id && (
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                u.status === 'active'
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                            >
                              {u.status === 'active' ? 'Suspend Account' : 'Reactivate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Audit Logs Feed */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-midnight-900">Security Audit Trail</h3>
            <div className="rounded-2xl bg-white border border-slate-300 overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-pale-200 border-b border-slate-300 text-[11px] font-bold uppercase tracking-wider text-midnight-900">
                      <th className="py-3.5 px-6">Timestamp</th>
                      <th className="py-3.5 px-4">Severity</th>
                      <th className="py-3.5 px-4">Action Event</th>
                      <th className="py-3.5 px-4">User ID</th>
                      <th className="py-3.5 px-6">Event Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-pale-100/70 transition-colors">
                        <td className="py-3.5 px-6 text-slate-600">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 uppercase font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              log.level === 'error'
                                ? 'bg-rose-100 text-rose-800'
                                : log.level === 'warn'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {log.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-midnight-900">{log.action}</td>
                        <td className="py-3.5 px-4 text-slate-500">{log.userId ? log.userId.substring(0, 8) + '...' : 'SYSTEM'}</td>
                        <td className="py-3.5 px-6 text-slate-700 truncate max-w-xs">
                          {JSON.stringify(log.details || {})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
