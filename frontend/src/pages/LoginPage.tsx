import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ShieldCheck, Sparkles, ArrowRight, KeyRound, Wrench, Package, Activity, CheckCircle2, Shield } from 'lucide-react';

interface LoginPageProps {
  onNavigateForgot: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateForgot }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#030712] font-sans selection:bg-cyan-500/30 text-slate-100 overflow-x-hidden">
      
      {/* LEFT COLUMN: Modern Enterprise SaaS Hero Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 xl:p-16 relative overflow-hidden border-r border-slate-800/80 bg-gradient-to-b from-[#030712] via-[#0b0f19] to-[#030712]">
        
        {/* Dynamic Background Mesh & Ambient Glow Lights */}
        <div className="absolute top-[-10%] left-[-10%] w-[650px] h-[650px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        {/* Brand Badge & Header */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 ring-1 ring-white/20">
            <KeyRound size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-black tracking-wider text-white">KEYSTONE</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm">FIELD OS v2.0</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 tracking-wide">Enterprise Field Operations Engine</p>
          </div>
        </div>

        {/* Main Value Showcase */}
        <div className="relative z-10 my-auto max-w-xl space-y-8 py-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-cyan-400 shadow-inner">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Next-Gen Field Service Management</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Real-Time Dispatches, Technicians & Inventories.
            </h1>
            <p className="text-sm xl:text-base text-slate-400 leading-relaxed font-normal">
              An all-in-one operating system designed for dispatchers, facility managers, and field technicians with SLA breach prevention, live GPS tracking, and parts inventory sync.
            </p>
          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="ks-glass-card p-4 space-y-2.5 hover:border-cyan-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Activity size={20} />
              </div>
              <h4 className="text-xs font-bold text-white">SLA Guard</h4>
              <p className="text-[11px] text-slate-400 leading-snug">Automated SLA rules & priority notifications.</p>
            </div>

            <div className="ks-glass-card p-4 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Wrench size={20} />
              </div>
              <h4 className="text-xs font-bold text-white">Technician Portal</h4>
              <p className="text-[11px] text-slate-400 leading-snug">Mobile time logs, part usage & customer sign-offs.</p>
            </div>

            <div className="ks-glass-card p-4 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Package size={20} />
              </div>
              <h4 className="text-xs font-bold text-white">Live Inventory</h4>
              <p className="text-[11px] text-slate-400 leading-snug">Part usage tracking & auto stock reorder levels.</p>
            </div>
          </div>
        </div>

        {/* Bottom Operational Status Bar */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>Operational • All Services Online</span>
          </div>
          <span>© 2026 Meridian Solutions</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Auth Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative">
        
        {/* Mobile Header */}
        <div className="lg:hidden mb-8 text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-xl shadow-cyan-500/25 ring-1 ring-white/20">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider">KEYSTONE</h1>
          <p className="text-xs text-slate-400">Field Service Management Platform</p>
        </div>

        {/* Auth Form Card */}
        <div className="w-full max-w-md space-y-7 ks-glass-card p-8 sm:p-10 shadow-2xl border border-slate-800">
          
          <div className="space-y-1.5 text-left">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In</h2>
            <p className="text-xs text-slate-400">Enter your credentials to access your workspace.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-950/80 border border-red-500/50 text-red-300 text-xs rounded-2xl text-center font-medium animate-shake shadow-lg">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="ks-label">Email Address</label>
              <div className="ks-input-group">
                <span className="ks-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="user@meridian.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="ks-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="ks-label">Password</label>
                <button
                  type="button"
                  onClick={onNavigateForgot}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="ks-input-group">
                <span className="ks-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="ks-input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="ks-btn-primary w-full mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to KEYSTONE</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="pt-6 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" /> Quick Demo Accounts
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Password: password123</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillQuickLogin('admin@meridian.com')}
                className="p-3 bg-slate-950/70 hover:bg-slate-800/80 rounded-xl text-left border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-sm"
              >
                <div className="text-xs font-bold text-cyan-400 flex items-center justify-between">
                  <span>Manager</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-300 font-mono truncate mt-0.5">admin@meridian.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('dispatcher@meridian.com')}
                className="p-3 bg-slate-950/70 hover:bg-slate-800/80 rounded-xl text-left border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group shadow-sm"
              >
                <div className="text-xs font-bold text-purple-400 flex items-center justify-between">
                  <span>Dispatcher</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-300 font-mono truncate mt-0.5">dispatcher@meridian.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('tech.john@meridian.com')}
                className="p-3 bg-slate-950/70 hover:bg-slate-800/80 rounded-xl text-left border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-sm"
              >
                <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
                  <span>Technician</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-300 font-mono truncate mt-0.5">tech.john@meridian.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('customer.acme@meridian.com')}
                className="p-3 bg-slate-950/70 hover:bg-slate-800/80 rounded-xl text-left border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-sm"
              >
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>Customer</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-300 font-mono truncate mt-0.5">customer.acme@meridian.com</div>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};