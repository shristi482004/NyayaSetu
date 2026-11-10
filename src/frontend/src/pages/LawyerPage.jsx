import React, { useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { FileUploadZone } from '../components/dashboard/FileUploadZone';
import { DocumentList } from '../components/dashboard/DocumentList';

export const LawyerPage = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-pale-200 flex flex-col justify-between selection:bg-midnight-900 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Lawyer Workspace Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-300">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-slate-600">
              <span>Legal Practitioner Workspace</span>
              <span>•</span>
              <span className="font-mono text-gold-500">Enrolled Advocate Portal</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-midnight-900 mt-1">
              Counsel Workspace — {user?.name}
            </h1>
            <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1">
              Upload case briefs, review procedural timelines, analyze dual-column argument maps, and conduct grounded Q&A.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full bg-midnight-900 text-white text-xs font-mono font-medium shadow-sm border border-slate-700">
              Role: Legal Advocate (Argument Maps Active)
            </span>
          </div>
        </div>

        {/* Lawyer Capability Highlight Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-midnight-900 text-white border border-slate-800 shadow-panel">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider inline-block">
              Advocate Feature Set Active
            </span>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-white">
              Dual-Column Legal Argument Mapping
            </h3>
            <p className="text-xs md:text-sm font-sans text-slate-200 leading-relaxed">
              When reviewing documents in your library, the specialized "Argument Map" tab contrasts claimant basis and evidentiary substantiation against viable counter-arguments under statutory limitations.
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <section className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-midnight-900">
            Upload Case Document / Notice
          </h2>
          <FileUploadZone onUploadSuccess={() => setRefreshTrigger((p) => p + 1)} />
        </section>

        {/* Document Library */}
        <section className="pt-2">
          <DocumentList
            refreshTrigger={refreshTrigger}
            onDocumentDeleted={() => setRefreshTrigger((p) => p + 1)}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};
