import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AddressInput } from '../components/AddressInput';
import {
  Mail, Lock, Loader2, ShieldCheck, Sparkles, ArrowRight, KeyRound, Wrench, Package,
  Activity, CheckCircle2, UserPlus, Building, Phone, X, Clock, Layers, Users, Zap,
  ChevronDown, ChevronUp, HelpCircle, Check, MapPin, Globe, Server, Star, Compass
} from 'lucide-react';

interface LoginPageProps {
  onNavigateForgot: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateForgot }) => {
  const { login } = useAuth();
  
  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Interactive Live Demo Tab State
  const [demoView, setDemoView] = useState<'dispatch' | 'tech' | 'parts'>('dispatch');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

  const faqs = [
    {
      question: "How does real-time SLA breach prevention work?",
      answer: "KEYSTONE automatically assigns SLA countdown timers based on ticket priority (Low 72h, Medium 48h, High 24h, Urgent 4h). Dispatchers receive automated breach warnings before SLA thresholds expire."
    },
    {
      question: "Can new customer organizations register self-service accounts?",
      answer: "Yes! Customers can register their organization account directly through the portal, allowing immediate creation of facility maintenance tickets and real-time status tracking."
    },
    {
      question: "How does spare parts inventory decrementing operate?",
      answer: "When field technicians log used spare parts on an active work order, central inventory levels automatically decrement, triggering low-stock reorder threshold alerts for administrators."
    },
    {
      question: "What security and compliance measures protect operational data?",
      answer: "KEYSTONE utilizes multi-role RBAC security, bcrypt password hashing, 256-bit encrypted JWT session tokens, and Neon PostgreSQL SSL database pooler connections."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 selection:bg-sky-500/20 overflow-x-hidden flex flex-col justify-between">
      
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION HEADER */}
      {/* ========================================================================= */}
      <header className="glass-nav sticky top-0 z-40 px-6 lg:px-12 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <KeyRound size={20} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-slate-900">KEYSTONE</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 hidden sm:inline-flex items-center gap-1">
              <Sparkles size={10} className="text-sky-600" /> FIELD OS v2.0
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#hero" className="hover:text-sky-600 transition-colors">Overview</a>
          <a href="#demo" className="hover:text-sky-600 transition-colors">Live Console Demo</a>
          <a href="#capabilities" className="hover:text-sky-600 transition-colors">Features</a>
          <a href="#metrics" className="hover:text-sky-600 transition-colors">Metrics</a>
          <a href="#faq" className="hover:text-sky-600 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('login')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
          >
            Sign In
          </button>
          <button
            onClick={() => openModal('register')}
            className="ks-btn-primary h-9 text-xs px-4"
          >
            Get Started Free
          </button>
        </div>
      </header>

      <main className="flex-1 space-y-20 py-8">
        
        {/* ========================================================================= */}
        {/* 2. BRAND NEW HERO BANNER */}
        {/* ========================================================================= */}
        <section id="hero" className="relative px-6 lg:px-12 max-w-7xl mx-auto w-full pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-7 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-700 shadow-2xs">
                <Zap size={14} className="text-sky-600 fill-sky-600" />
                <span>Next-Gen Enterprise Field Service & Fleet Operating System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Empowering Smart Fleet Logistics & <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Field Execution</span>.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-2xl">
                A unified platform connecting dispatch command, real-time SLA countdown timers, technician mobile work logging, and automated spare parts inventory replenishment.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={() => openModal('login')}
                  className="ks-btn-primary py-3.5 px-8 text-xs font-bold shadow-lg shadow-sky-500/20 group"
                >
                  <span>Launch Operational Console</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => openModal('register')}
                  className="ks-btn-secondary py-3.5 px-6 text-xs font-bold hover:border-sky-300"
                >
                  <span>Register Customer Account</span>
                </button>
              </div>

              {/* Security & Infrastructure Pills */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-500 border-t border-slate-200">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Neon PostgreSQL Engine</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <ShieldCheck size={15} className="text-sky-600" />
                  <span>Multi-Role RBAC Security</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <Globe size={15} className="text-indigo-600" />
                  <span>99.99% Guaranteed SLA</span>
                </div>
              </div>
            </div>

            {/* Hero Quick Auth Preview Box */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl space-y-5 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="font-bold text-xs text-slate-900">Console Quick Access</span>
                  </div>
                  <span className="font-mono text-[10px] text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-semibold">
                    ENTERPRISE V2.0
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sign in to access dispatch metrics, technician task queues, client customer accounts, and spare parts inventory control.
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span>Supported Workspaces:</span>
                      <span className="text-sky-600 font-mono text-[10px]">4 RBAC ROLES</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold">🛡️ Administrator</span>
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold">⚡ Dispatcher</span>
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold">🔧 Technician</span>
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-700 font-semibold">🏢 Customer Portal</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={() => openModal('login')}
                    className="ks-btn-primary w-full py-3 text-xs"
                  >
                    <span>Sign In to Console</span>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    onClick={() => openModal('register')}
                    className="ks-btn-secondary w-full py-3 text-xs"
                  >
                    <UserPlus size={15} />
                    <span>Register New Customer Account</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. INTERACTIVE LIVE CONSOLE SIMULATION DEMO */}
        {/* ========================================================================= */}
        <section id="demo" className="px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="bg-white p-8 lg:p-10 border border-slate-200 rounded-3xl space-y-8 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-widest px-3 py-1 rounded-full bg-sky-50 border border-sky-200">
                  Interactive Console Preview
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">Experience KEYSTONE Telemetry</h2>
              </div>

              {/* View Switcher Pills */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setDemoView('dispatch')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    demoView === 'dispatch' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dispatch Matrix
                </button>
                <button
                  onClick={() => setDemoView('tech')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    demoView === 'tech' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Field Task Queue
                </button>
                <button
                  onClick={() => setDemoView('parts')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    demoView === 'parts' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Parts Inventory
                </button>
              </div>
            </div>

            {/* Dynamic View Rendering */}
            {demoView === 'dispatch' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">Total Tickets</div>
                    <div className="text-xl font-black text-slate-900 mt-0.5">142</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">SLA Met Rate</div>
                    <div className="text-xl font-black text-emerald-600 mt-0.5">99.4%</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">New Requests</div>
                    <div className="text-xl font-black text-sky-600 mt-0.5">18</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">SLA Breaches</div>
                    <div className="text-xl font-black text-slate-900 mt-0.5">0 Active</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="ks-table text-xs">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Work Order Title</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>SLA Countdown</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-mono font-bold text-sky-700">WO-1001</td>
                        <td className="font-bold text-slate-900">HVAC Compressor Inspection & Filter Replace</td>
                        <td className="text-slate-600">Nexus Retail Group</td>
                        <td><span className="badge badge-in-progress">In Progress</span></td>
                        <td><span className="badge badge-urgent">Urgent</span></td>
                        <td className="font-mono text-slate-600">3h 42m remaining</td>
                      </tr>
                      <tr>
                        <td className="font-mono font-bold text-sky-700">WO-1002</td>
                        <td className="font-bold text-slate-900">Thermostat Module Digital Sensor Calibration</td>
                        <td className="text-slate-600">Meridian Tower HQ</td>
                        <td><span className="badge badge-assigned">Assigned</span></td>
                        <td><span className="badge badge-high">High Tier</span></td>
                        <td className="font-mono text-slate-600">18h 15m remaining</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {demoView === 'tech' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-700">WO-1001</span>
                    <span className="badge badge-in-progress">In Progress</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">HVAC Compressor Inspection</h4>
                  <p className="text-slate-600">Site: Nexus Retail - Building B</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-mono text-[11px]">
                    <span className="text-purple-700 font-semibold">Tech: Alex Rivera</span>
                    <span className="text-emerald-700 font-bold">₹1,450 Parts Logged</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-700">WO-1002</span>
                    <span className="badge badge-assigned">Assigned</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Thermostat Sensor Calibration</h4>
                  <p className="text-slate-600">Site: Meridian Tower HQ - 4th Floor</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-mono text-[11px]">
                    <span className="text-purple-700 font-semibold">Tech: Sarah Chen</span>
                    <span className="text-slate-500 font-bold">Labor: 0 mins logged</span>
                  </div>
                </div>
              </div>
            )}

            {demoView === 'parts' && (
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="ks-table text-xs">
                  <thead>
                    <tr>
                      <th>Part Name</th>
                      <th>SKU Code</th>
                      <th>Unit Cost</th>
                      <th>Available Stock</th>
                      <th>Min Threshold</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold text-slate-900">HVAC Heavy-Duty Air Filter 24x24</td>
                      <td><span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">PART-HVAC-01</span></td>
                      <td className="font-mono text-emerald-600 font-bold">₹450.00</td>
                      <td className="font-mono font-bold text-slate-900">42 Units</td>
                      <td className="font-mono text-slate-500">10 Units</td>
                      <td><span className="badge badge-completed">In Stock</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold text-slate-900">Digital Thermostat Control Module</td>
                      <td><span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">PART-ELEC-09</span></td>
                      <td className="font-mono text-emerald-600 font-bold">₹1,250.00</td>
                      <td className="font-mono font-bold text-amber-600">3 Units</td>
                      <td className="font-mono text-slate-500">5 Units</td>
                      <td><span className="badge badge-urgent">Low Stock</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ENTERPRISE CAPABILITIES (4-GRID) */}
        {/* ========================================================================= */}
        <section id="capabilities" className="px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200">
                Enterprise Features
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Built for Mission-Critical Field Service</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3.5 bg-white shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center border border-sky-200">
                  <Activity size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900">SLA Breach Guard</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automated priority countdown clocks (Low 72h, Med 48h, High 24h, Urgent 4h) prevent SLA penalties.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3.5 bg-white shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200">
                  <Wrench size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900">Field Mobile Queue</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Field technicians log labor minutes, attach required spare parts, and record resolution notes on the go.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3.5 bg-white shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Package size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900">Auto Inventory Sync</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Used spare parts automatically decrement central stock levels with low-stock warnings and restock controls.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3.5 bg-white shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-bold text-base text-slate-900">RBAC Security Matrix</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Role-based security for Administrators, Dispatchers, Technicians, and Customer Organizations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. IMPACT METRICS BAR */}
        {/* ========================================================================= */}
        <section id="metrics" className="px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-8 lg:p-10 rounded-3xl text-white space-y-6 shadow-lg">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 border border-white/20">
                Enterprise Scale
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight">Trusted by Dispatch Operations Nationwide</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center pt-2">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black font-mono">99.9%</div>
                <div className="text-xs text-sky-100 font-medium">Uptime Guarantee</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black font-mono">10,000+</div>
                <div className="text-xs text-sky-100 font-medium">Tickets Processed</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black font-mono">&lt; 15m</div>
                <div className="text-xs text-sky-100 font-medium">Avg Dispatch Speed</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black font-mono">0</div>
                <div className="text-xs text-sky-100 font-medium">Uncaught SLA Breaches</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
        {/* ========================================================================= */}
        <section id="faq" className="px-6 lg:px-12 max-w-4xl mx-auto w-full">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-widest px-3 py-1 rounded-full bg-sky-50 border border-sky-200">
                FAQ & Knowledge Base
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle size={18} className="text-sky-600 shrink-0" />
                        <span>{faq.question}</span>
                      </div>
                      {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pl-11">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs">
              K
            </div>
            <span className="font-bold text-slate-800 text-sm">KEYSTONE Field OS</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Neon PostgreSQL Connected • All Systems Operational</span>
          </div>
          <div>© 2026 KEYSTONE Enterprise Systems</div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* POPUP SIGN IN & CUSTOMER REGISTRATION MODAL DIALOG */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl relative overflow-hidden bg-white rounded-3xl">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow">
                  <KeyRound size={16} />
                </div>
                <span className="font-black text-sm text-slate-900">KEYSTONE Console</span>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Feedback alert messages */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-medium animate-shake">
                <span>{error}</span>
              </div>
            )}
            {regSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl text-center font-medium">
                <span>{regSuccess}</span>
              </div>
            )}

            {/* FORM TAB 1: Enterprise Sign In */}
            {authTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Sign In</h3>
                  <p className="text-xs text-slate-500">Enter your account credentials to log in</p>
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
                      className="text-xs text-sky-600 hover:underline font-semibold cursor-pointer"
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
                  <h3 className="text-lg font-bold text-slate-900">Register Customer Organization</h3>
                  <p className="text-xs text-slate-500">Create a new customer account for dispatch & maintenance ticketing</p>
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