import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AddressInput } from '../components/AddressInput';
import {
  Mail, Lock, Loader2, ShieldCheck, Sparkles, ArrowRight, KeyRound, Wrench, Package,
  Activity, CheckCircle2, Shield, UserPlus, Building, Building2, MapPin, Check, Phone,
  X, Compass, ChevronRight, Layers, Clock, Cpu, Server
} from 'lucide-react';

interface LoginPageProps {
  onNavigateForgot: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateForgot }) => {
  const { login } = useAuth();
  
  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Sign In states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Self-registration (Create Account) states
  const [regName, setRegName] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const openModal = (tab: 'login' | 'register' = 'login') => {
    setAuthTab(tab);
    setError(null);
    setRegSuccess(null);
    setShowAuthModal(true);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRegSuccess(null);
    try {
      await api.createCustomer({
        name: regName,
        code: regCode || `CUST-${regName.replace(/\s+/g, '').toUpperCase().slice(0, 6)}`,
        contactEmail: regEmail,
        contactPhone: regPhone,
        address: regAddress,
      });
      setRegSuccess('Organization account created successfully! Please sign in with your email.');
      setEmail(regEmail);
      setPassword('');
      setAuthTab('login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check form details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030610] font-sans text-slate-100 selection:bg-cyan-500/30 overflow-x-hidden flex flex-col justify-between">
      
      {/* Top Navbar */}
      <header className="glass-nav sticky top-0 z-40 px-6 lg:px-12 h-16 flex items-center justify-between border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/20">
            <KeyRound size={18} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-base tracking-wider text-white">KEYSTONE</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 hidden sm:inline-flex">
              FIELD OS
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#overview" className="hover:text-cyan-400 transition-colors">Overview</a>
          <a href="#capabilities" className="hover:text-cyan-400 transition-colors">Capabilities</a>
          <a href="#workflow" className="hover:text-cyan-400 transition-colors">How It Works</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('login')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all cursor-pointer border border-transparent hover:border-slate-800"
          >
            Sign In
          </button>
          <button
            onClick={() => openModal('register')}
            className="ks-btn-primary h-9 text-xs px-4"
          >
            Create Account
          </button>
        </div>
      </header>

      <main className="flex-1 space-y-24 py-12">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO & PLATFORM OVERVIEW */}
        {/* ========================================================================= */}
        <section id="overview" className="relative px-6 lg:px-12 max-w-7xl mx-auto w-full pt-6">
          {/* Background Ambient Mesh Lights */}
          <div className="absolute top-[-10%] left-1/3 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-1/4 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[170px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-bold text-cyan-400 shadow-sm">
                <Sparkles size={14} className="text-cyan-400" />
                <span>Next-Gen Field Service & Fleet Operating System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1]">
                The Operating System for Enterprise Field Service.
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal max-w-2xl">
                KEYSTONE unifies dispatch matrix command, field technician execution, SLA breach prevention, and spare parts inventory depletion into a real-time synchronized platform.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => openModal('login')}
                  className="ks-btn-primary py-3.5 px-7 text-xs font-bold shadow-lg shadow-cyan-500/20 group"
                >
                  <span>Sign In to Console</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => openModal('register')}
                  className="ks-btn-secondary py-3.5 px-6 text-xs font-bold hover:border-cyan-500/40"
                >
                  <span>Register Customer Account</span>
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs text-slate-500 border-t border-white/5">
                <div className="flex items-center gap-2 font-semibold text-slate-400">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Neon Database Engine Active</span>
                </div>
                <div>•</div>
                <div>Multi-Role RBAC Security</div>
                <div>•</div>
                <div>99.99% Guaranteed SLA</div>
              </div>
            </div>

            {/* Visual Hero Dashboard Telemetry Preview Card */}
            <div className="lg:col-span-5 w-full">
              <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-2xl space-y-5 relative overflow-hidden bg-gradient-to-b from-slate-950/90 to-[#070b16]/90">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="font-bold text-xs text-white">KEYSTONE Live Telemetry</span>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    REALTIME SYNC
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Tickets</div>
                    <div className="text-xl font-mono font-black text-cyan-400">128</div>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">SLA Met Rate</div>
                    <div className="text-xl font-mono font-black text-emerald-400">99.4%</div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-amber-400" />
                      <span className="font-mono text-slate-200">WO-1002 • HVAC Cooling</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">IN PROGRESS</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span className="font-mono text-slate-200">WO-1005 • Thermostat Calib</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">COMPLETED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: CORE OPERATIONAL CAPABILITIES */}
        {/* ========================================================================= */}
        <section id="capabilities" className="px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="glass-card p-8 lg:p-12 border border-white/10 rounded-3xl space-y-10 shadow-2xl bg-slate-950/40">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Built for Mission-Critical Field Operations</h2>
              <p className="text-xs sm:text-sm text-slate-400">Everything dispatchers, managers, and field technicians need in one synchronized engine.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-cyan-500/50 transition-all hover:translate-y-[-2px] shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Activity size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Automated SLA Protection Guard</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Configurable SLA clocks based on priority levels (Low 72h, Medium 48h, High 24h, Urgent 4h). Real-time breach alerts protect response benchmarks.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-purple-500/50 transition-all hover:translate-y-[-2px] shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Wrench size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Field Technician Mobile Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Field technicians record labor minutes, attach required spare parts from inventory, update ticket statuses, and capture digital customer sign-offs.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 hover:border-emerald-500/50 transition-all hover:translate-y-[-2px] shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Package size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Live Parts Inventory Sync</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Part inventory levels automatically decrement upon work order completion with minimum threshold warnings and quick restock controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: ENTERPRISE WORKFLOW (HOW IT WORKS) */}
        {/* ========================================================================= */}
        <section id="workflow" className="px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                End-To-End Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">How KEYSTONE Operates in 3 Steps</h2>
              <p className="text-xs sm:text-sm text-slate-400">Streamlined execution from initial ticket logging to field completion.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Step 1 */}
              <div className="bg-slate-950/70 p-7 rounded-2xl border border-white/10 space-y-4 relative">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 font-mono font-black text-sm flex items-center justify-center border border-cyan-500/20">
                  01
                </div>
                <h3 className="text-base font-bold text-white">Ticket Request & Dispatch</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Customers submit maintenance tickets via portal or dispatchers create work orders directly with priority level SLA assignment.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950/70 p-7 rounded-2xl border border-white/10 space-y-4 relative">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 font-mono font-black text-sm flex items-center justify-center border border-purple-500/20">
                  02
                </div>
                <h3 className="text-base font-bold text-white">Field Execution & SLA Clocks</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Assigned technicians navigate to building sites, log labor time, record installed spare parts, and track real-time SLA due countdowns.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950/70 p-7 rounded-2xl border border-white/10 space-y-4 relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono font-black text-sm flex items-center justify-center border border-emerald-500/20">
                  03
                </div>
                <h3 className="text-base font-bold text-white">Part Depletion & Resolution</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upon job completion, parts inventory automatically decrements, SLA metrics update, and job history is permanently archived.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => openModal('login')}
                className="ks-btn-primary py-3.5 px-8 text-xs font-bold shadow-lg shadow-cyan-500/20"
              >
                <span>Access KEYSTONE Console</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Website Footer */}
      <footer className="px-6 lg:px-12 py-8 bg-[#02040a] border-t border-white/5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs">
              K
            </div>
            <span className="font-bold text-slate-300 text-sm">KEYSTONE Field OS</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Neon DB Connected • All Systems Operational</span>
          </div>
          <div>© 2026 KEYSTONE Enterprise Systems</div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* POPUP SIGN IN & CUSTOMER REGISTRATION MODAL DIALOG */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 space-y-6 border border-white/10 shadow-2xl relative overflow-hidden bg-[#090d18] rounded-3xl">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow">
                  <KeyRound size={16} />
                </div>
                <span className="font-black text-sm text-white">KEYSTONE Console</span>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Feedback alert messages */}
            {error && (
              <div className="p-3.5 bg-red-950/80 border border-red-500/50 text-red-300 text-xs rounded-xl text-center font-medium animate-shake">
                <span>{error}</span>
              </div>
            )}
            {regSuccess && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl text-center font-medium">
                <span>{regSuccess}</span>
              </div>
            )}

            {/* FORM TAB 1: Clean Enterprise Sign In (No Demo Logins) */}
            {authTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Sign In</h3>
                  <p className="text-xs text-slate-400">Enter your account credentials to log in</p>
                </div>

                <div className="space-y-1">
                  <label className="ks-label">Email Address</label>
                  <div className="ks-input-group">
                    <span className="ks-input-icon">
                      <Mail size={16} />
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

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="ks-label">Password</label>
                    <button
                      type="button"
                      onClick={() => { setShowAuthModal(false); onNavigateForgot(); }}
                      className="text-xs text-cyan-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="ks-input-group">
                    <span className="ks-input-icon">
                      <Lock size={16} />
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
                  className="ks-btn-primary w-full mt-2 py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to KEYSTONE</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* FORM TAB 2: Customer Account Creation */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Register Customer Organization</h3>
                  <p className="text-xs text-slate-400">Create a new customer account for dispatch & maintenance ticketing</p>
                </div>

                <div className="space-y-1">
                  <label className="ks-label">Organization Name *</label>
                  <div className="ks-input-group">
                    <span className="ks-input-icon"><Building size={16} /></span>
                    <input
                      type="text"
                      placeholder="e.g. Nexus Retail Group"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      className="ks-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="ks-label">Contact Email *</label>
                  <div className="ks-input-group">
                    <span className="ks-input-icon"><Mail size={16} /></span>
                    <input
                      type="email"
                      placeholder="facility@nexus.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="ks-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="ks-label">Phone Number</label>
                  <div className="ks-input-group">
                    <span className="ks-input-icon"><Phone size={16} /></span>
                    <input
                      type="text"
                      placeholder="+1 (555) 019-2834"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="ks-input"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="ks-label">HQ Address</label>
                  <AddressInput
                    value={regAddress}
                    onChange={setRegAddress}
                    placeholder="Type address or use GPS..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="ks-btn-primary w-full mt-2 py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
