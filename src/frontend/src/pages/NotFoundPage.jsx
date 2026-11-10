import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ArrowUpRightBadge } from '../components/common/BrandGraphics';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-pale-200 flex flex-col justify-between selection:bg-midnight-900 selection:text-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full p-10 rounded-2xl bg-white border border-slate-300 shadow-subtle text-center space-y-6">
          <div className="w-16 h-16 rounded-xl bg-midnight-900 text-gold-400 mx-auto flex items-center justify-center font-mono font-bold text-2xl border border-slate-700">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-midnight-900">
              Page Not Found
            </h1>
            <p className="text-sm font-sans text-slate-600 leading-relaxed">
              The requested legal document or endpoint does not exist or has been moved to a different workspace location.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-midnight-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs uppercase tracking-wider transition-all shadow-sm group"
            >
              <span>Return to Platform Home</span>
              <ArrowUpRightBadge className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

