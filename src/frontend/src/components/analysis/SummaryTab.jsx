import React from 'react';

export const SummaryTab = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="space-y-8">
      {/* Dispute Type & Parties Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-sans font-bold text-slate-600">
            Dispute Classification
          </span>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-midnight-900 mt-1">
            {summary.disputeType || 'Legal Document Review'}
          </h3>
        </div>

        {/* Key Parties */}
        {summary.keyParties && summary.keyParties.length > 0 && (
          <div>
            <span className="block text-xs uppercase tracking-wider font-sans font-bold text-slate-600 mb-2.5">
              Identified Parties
            </span>
            <div className="flex flex-wrap gap-2">
              {summary.keyParties.map((party, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-midnight-900 text-white text-xs font-sans font-semibold shadow-sm"
                >
                  {party}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Plain Language Summary Callout */}
      <div className="p-8 rounded-2xl bg-midnight-900 text-white border border-slate-800 shadow-panel space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-slate-800 text-gold-400 text-xs font-mono font-bold tracking-wider border border-slate-700">
          PLAIN-LANGUAGE SUMMARY
        </div>
        <p className="text-base md:text-lg leading-relaxed text-slate-100 font-sans font-medium">
          {summary.plainLanguageSummary || 'No summary text available.'}
        </p>
      </div>

      {/* Factual Background & Legal Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Factual Background */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-4">
          <h4 className="text-base font-serif font-bold text-midnight-900 border-b border-slate-200 pb-3">
            Factual Background
          </h4>
          <ul className="space-y-3">
            {(summary.factualBackground || []).map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-sans text-slate-700 leading-relaxed">
                <span className="text-midnight-900 font-mono font-bold shrink-0 mt-0.5">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Issues */}
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-4">
          <h4 className="text-base font-serif font-bold text-midnight-900 border-b border-slate-200 pb-3">
            Core Legal Issues
          </h4>
          <ul className="space-y-3">
            {(summary.legalIssues || []).map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-sans text-slate-700 leading-relaxed">
                <span className="text-gold-500 font-mono font-bold shrink-0 mt-0.5">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rulings or Obligations */}
      {summary.rulingsOrObligations && summary.rulingsOrObligations.length > 0 && (
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-4">
          <h4 className="text-base font-serif font-bold text-midnight-900 border-b border-slate-200 pb-3">
            Key Obligations & Statutory Rulings
          </h4>
          <div className="space-y-2.5">
            {summary.rulingsOrObligations.map((ruling, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-pale-100 border border-slate-200 text-xs font-sans text-slate-800 leading-relaxed"
              >
                {ruling}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
