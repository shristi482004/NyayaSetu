import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { NyayaSetuLogo, ArrowUpRightBadge } from '../components/common/BrandGraphics';
import { AlertBanner } from '../components/common/AlertBanner';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (pass) => {
    if (pass.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter.';
    if (!/[0-9]/.test(pass)) return 'Password must contain at least one number.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        const destination =
          res.data.user.role === 'admin'
            ? '/admin'
            : res.data.user.role === 'lawyer'
              ? '/lawyer'
              : '/dashboard';
        navigate(destination, { replace: true });
      } else {
        setError(res.message || 'Registration failed. Please review your input.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration could not be completed. The email address may already be in use.';
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

      {/* Main Split Registration Card */}
      <div className="max-w-5xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 min-w-0 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-panel">
        {/* Left Column: Midnight Navy Architectural Panel (High Contrast & Clear Readability) */}
        <div className="lg:col-span-5 min-w-0 bg-midnight-900 text-white p-6 sm:p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Subtle Structural Grid */}
          <div className="absolute inset-0 bg-grid-classical-dark opacity-20 pointer-events-none"></div>

          <div className="relative z-10 space-y-4 sm:space-y-6">
            <div className="inline-block px-3 py-1 rounded bg-slate-800 text-gold-400 text-[10px] font-mono tracking-widest uppercase border border-slate-700">
              NEW ACCOUNT REGISTRATION
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white leading-snug">
              Begin Understanding Complex Legal Documents
            </h2>

            <p className="text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
              Create an account to gain instant access to document extraction, plain-language summaries, procedural flowcharting, and grounded Q&A.
            </p>

            {/* Persona Guidance Cards */}
            <div className="pt-2 space-y-2.5 sm:space-y-3">
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                <span className="text-xs font-sans font-bold text-gold-400 uppercase tracking-wider block">
                  Citizen Workspace
                </span>
                <p className="text-xs font-sans text-slate-200 leading-relaxed">
                  Plain-language explanations of notices, lease agreements, and timelines.
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                <span className="text-xs font-sans font-bold text-slate-200 uppercase tracking-wider block">
                  Legal Practitioner Workspace
                </span>
                <p className="text-xs font-sans text-slate-200 leading-relaxed">
                  Dual-column Argument Mapping, counter-claims, and statutory cross-references.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 text-[11px] sm:text-xs font-sans text-slate-300 leading-relaxed">
            All user data is cryptographically isolated and never used for public AI training.
          </div>
        </div>

        {/* Right Column: Registration Form (Crisp White Canvas) */}
        <div className="lg:col-span-7 min-w-0 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-slate-600 block">
                Institutional Onboarding
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-midnight-900 mt-1">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1.5">
                Select your role and enter your details to launch your legal workspace.
              </p>
            </div>

            {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-midnight-900 mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-pale-200 rounded-lg border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`py-1.5 sm:py-2 px-1 sm:px-2 rounded-md text-[11px] sm:text-xs font-sans font-bold transition-all ${role === 'citizen'
                        ? 'bg-midnight-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-midnight-900 hover:bg-white/60'
                      }`}
                  >
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('lawyer')}
                    className={`py-1.5 sm:py-2 px-1 sm:px-2 rounded-md text-[11px] sm:text-xs font-sans font-bold transition-all ${role === 'lawyer'
                        ? 'bg-midnight-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-midnight-900 hover:bg-white/60'
                      }`}
                  >
                    Lawyer
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] font-sans text-slate-500">
                  Administrator accounts cannot be registered publicly and must be provisioned securely.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-midnight-900 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adv. Ramesh Sharma"
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white border border-slate-300 text-midnight-900 text-sm focus:outline-none focus:border-midnight-900 focus:ring-1 focus:ring-midnight-900 transition-all placeholder:text-slate-400 font-sans shadow-sm"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-midnight-900 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white border border-slate-300 text-midnight-900 text-sm focus:outline-none focus:border-midnight-900 focus:ring-1 focus:ring-midnight-900 transition-all placeholder:text-slate-400 font-sans shadow-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-midnight-900 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white border border-slate-300 text-midnight-900 text-sm focus:outline-none focus:border-midnight-900 focus:ring-1 focus:ring-midnight-900 transition-all placeholder:text-slate-400 font-sans shadow-sm"
                />
                <div className="mt-1 text-[11px] font-sans text-slate-500 leading-tight">
                  Must be at least 8 characters with uppercase, lowercase, and numbers.
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg bg-midnight-900 hover:bg-slate-800 active:bg-midnight-950 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-sans font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
                  {!isSubmitting && <ArrowUpRightBadge className="w-4 h-4 text-white" />}
                </button>
              </div>
            </form>

            <div className="pt-5 border-t border-slate-200 text-center text-xs font-sans text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-midnight-900 hover:text-slate-700 underline underline-offset-2 ml-1"
              >
                Sign In
              </Link>
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
