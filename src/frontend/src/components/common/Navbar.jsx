import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NyayaSetuLogo, ArrowUpRightBadge } from './BrandGraphics';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isLawyer } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Trust', href: '#trust' },
    { label: 'FAQ', href: '#faq' },
  ];

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isLawyer) return '/lawyer';
    return '/dashboard';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-navbar border-b border-navbar-border text-white transition-all w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-20 md:h-[5.5rem] flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="focus:outline-none shrink-0" title="NyayaSetu Home">
          <NyayaSetuLogo variant="dark" size="navbar" />
        </Link>

        {/* Minimal Desktop Navigation Links in Centre */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-slate-300 hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-gold-500 after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Controls: Sign In & Rounded CTA Pill */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#010811] text-xs font-semibold uppercase tracking-wider hover:bg-pale-200 transition-colors shadow-subtle group"
              >
                <span>Workspace</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#010811] text-white font-medium">
                  {user?.role || 'Citizen'}
                </span>
                <ArrowUpRightBadge className="w-3.5 h-3.5 text-[#010811]" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-medium uppercase tracking-[0.14em] text-slate-300 hover:text-white transition-colors px-2 py-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-pale-200 text-[#010811] text-xs font-sans font-semibold uppercase tracking-[0.12em] transition-all shadow-subtle group"
              >
                <span>Get Started</span>
                <ArrowUpRightBadge className="w-3.5 h-3.5 text-[#010811]" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navbar border-b border-navbar-border px-6 py-6 space-y-4 shadow-elevated animate-fadeIn">
          <nav className="flex flex-col space-y-3 pb-4 border-b border-white/10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300 hover:text-white py-1.5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-white text-[#010811] text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Enter Workspace</span>
                  <ArrowUpRightBadge className="w-3.5 h-3.5 text-[#010811]" />
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-200 border border-white/20 rounded-full hover:border-white/40 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-white text-[#010811] text-xs font-semibold uppercase tracking-wider shadow-subtle flex items-center justify-center gap-2"
                >
                  <span>Analyze a Document</span>
                  <ArrowUpRightBadge className="w-3.5 h-3.5 text-[#010811]" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      </header>
      {/* Spacer to preserve document flow and prevent content from being hidden underneath fixed navbar */}
      <div className="h-20 md:h-[5.5rem] w-full shrink-0" aria-hidden="true" />
    </>
  );
};
