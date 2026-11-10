import React, { useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { FileUploadZone } from '../components/dashboard/FileUploadZone';
import { DocumentList } from '../components/dashboard/DocumentList';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Increment refreshTrigger to signal DocumentList to re-fetch
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDocumentDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-pale-200 flex flex-col justify-between selection:bg-midnight-900 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10 space-y-10">
        {/* Workspace Greeting Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-300">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-slate-600">
              <span>Citizen Workspace</span>
              <span>•</span>
              <span className="text-gold-500 font-mono">Authenticated Session</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-midnight-900 mt-1">
              Welcome, {user?.name || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1">
              Manage uploaded legal notices, review procedural timelines, and launch grounded Q&A chat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-4 py-1.5 rounded-full bg-midnight-900 text-white font-mono font-medium shadow-sm border border-slate-700">
              Role: {user?.role || 'citizen'}
            </span>
          </div>
        </div>

        {/* Section 1: Drag-and-Drop File Upload */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-midnight-900">
              Upload Legal Document
            </h2>
            <span className="text-xs text-slate-500 font-mono">PDF Format (Max 25 MB)</span>
          </div>
          <FileUploadZone onUploadSuccess={handleUploadSuccess} />
        </section>

        {/* Section 2: Document Library Table & Actions */}
        <section className="pt-2">
          <DocumentList
            refreshTrigger={refreshTrigger}
            onDocumentDeleted={handleDocumentDeleted}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};
