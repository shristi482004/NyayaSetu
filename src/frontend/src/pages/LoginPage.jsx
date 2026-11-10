import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { NyayaSetuLogo, ArrowUpRightBadge } from '../components/common/BrandGraphics';
import { AlertBanner } from '../components/common/AlertBanner';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.login(email.trim().toLowerCase(), password);

      if (res.success && res.data) {
        login(res.data.token, res.data.user);

        // Redirect to intended route or role-specific workspace
        const destination =
          location.state?.from?.pathname ||
          (res.data.user.role === 'admin'
            ? '/admin'
            : res.data.user.role === 'lawyer'
              ? '/lawyer'
              : '/dashboard');

        navigate(destination, { replace: true });
      } else {
        setError(res.message || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Unable to connect to the authentication service. Please verify your connection.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pale-200 flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 selection:bg-midnight-900 selection:text-white overflow-x-hidden">
      {/* Top Bar Navigation */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6">
        <Link to="/" className="focus:outline-none" title="NyayaSetu Home">
          <NyayaSetuLogo variant="light" size="navbar" />
        </Link>
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.14em] font-sans font-semibold text-slate-700 hover:text-midnight-900 transition-colors flex items-center gap-1"
        >
          <span>&larr;</span>
          <span>Home</span>
        </Link>
      </div>

      {/* Main Split Authentication Card */}
      <div className="max-w-5xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 min-w-0 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-panel">
        {/* Left Column: Midnight Navy Architectural Panel (High Contrast & Clear Readability) */}
        <div className="lg:col-span-5 min-w-0 bg-midnight-900 text-white p-6 sm:p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Subtle Structural Grid */}
          <div className="absolute inset-0 bg-grid-classical-dark opacity-20 pointer-events-none"></div>

          <div className="relative z-10 space-y-4 sm:space-y-6">
            <div className="inline-block px-3 py-1 rounded bg-slate-800 text-gold-400 text-[10px] font-mono tracking-widest uppercase border border-slate-700">
              AUTHENTICATION GATEWAY
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white leading-snug">
              Access Your Legal Document Workspace
            </h2>

            <p className="text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
              Sign in to upload legal PDF documents, review structured procedural flowcharts, and ask grounded questions with exact page references.
            </p>

            <div className="pt-2 sm:pt-4 space-y-3 text-xs font-sans text-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="text-gold-400 font-mono font-bold shrink-0 mt-0.5">[x]</span>
                <span className="leading-relaxed">Role-aware workspace for Citizens, Lawyers, and Administrators</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-gold-400 font-mono font-bold shrink-0 mt-0.5">[x]</span>
                <span className="leading-relaxed">Strict tenant document isolation and encryption in transit</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-gold-400 font-mono font-bold shrink-0 mt-0.5">[x]</span>
                <span className="leading-relaxed">Zero AI training on confidential client documents or chats</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 text-[11px] sm:text-xs font-sans text-slate-300 leading-relaxed">
            Informational assistance only. Does not constitute formal legal counsel.
          </div>
        </div>

        {/* Right Column: Sign In Form (Crisp White Canvas) */}
        <div className="lg:col-span-7 min-w-0 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-slate-600 block">
                Institutional Access
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-midnight-900 mt-1">
                Sign In
              </h1>
              <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1.5">
                Enter your credentials to access your legal document workspace.
              </p>
            </div>

            {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-midnight-900 mb-1.5 sm:mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white border border-slate-300 text-midnight-900 text-sm focus:outline-none focus:border-midnight-900 focus:ring-1 focus:ring-midnight-900 transition-all placeholder:text-slate-400 font-sans shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-midnight-900">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white border border-slate-300 text-midnight-900 text-sm focus:outline-none focus:border-midnight-900 focus:ring-1 focus:ring-midnight-900 transition-all placeholder:text-slate-400 font-sans shadow-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg bg-midnight-900 hover:bg-slate-800 active:bg-midnight-950 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-sans font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                  {!isSubmitting && <ArrowUpRightBadge className="w-4 h-4 text-white" />}
                </button>
              </div>
            </form>

            <div className="pt-5 border-t border-slate-200 text-center text-xs font-sans text-slate-600 space-y-1.5">
              <p>
                New to NyayaSetu?{' '}
                <Link
                  to="/register"
                  className="font-bold text-midnight-900 hover:text-slate-700 underline underline-offset-2 ml-1"
                >
                  Create an account
                </Link>
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Persona Options: citizen / lawyer / admin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Legal Banner */}
      <div className="max-w-5xl w-full mx-auto pt-6 text-center text-xs font-sans text-slate-500">
        NyayaSetu provides informational legal document assistance only and does not constitute formal legal counsel.
      </div>
    </div>
  );
};
