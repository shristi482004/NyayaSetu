import React from 'react';

export const ArgumentMapTab = ({ argumentMap, isLawyerOrAdmin }) => {
  if (!isLawyerOrAdmin) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-3">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 mx-auto flex items-center justify-center font-mono font-bold text-xs">
          [RESTRICTED]
        </div>
        <h4 className="text-base font-serif font-bold text-midnight-900">
          Lawyer-Only Argument Mapping
        </h4>
        <p className="text-xs font-sans text-slate-600 max-w-sm mx-auto">
          Dual-column argument synthesis and counter-claim evaluation is restricted to accounts registered with the Lawyer or Administrator persona.
        </p>
      </div>
    );
  }

  if (!argumentMap || argumentMap.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-300 shadow-subtle">
        <p className="text-sm font-sans text-slate-600">No argument map data available for this document.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs uppercase tracking-wider font-sans font-bold text-slate-600">
            Legal Defense & Claims Mapping
          </span>
          <h3 className="text-xl font-serif font-bold text-midnight-900 mt-1">
            Dual-Column Legal Argument Map
          </h3>
          <p className="text-xs font-sans text-slate-600 mt-0.5">
            Claimant claims and evidentiary substantiation evaluated against potential respondent counter-arguments.
          </p>
        </div>

        <div className="space-y-6 pt-2">
          {argumentMap.map((arg, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-pale-100 border border-slate-300 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Column: Claim & Evidence */}
              <div className="space-y-3 md:border-r md:border-slate-300 md:pr-6">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-midnight-900 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    Claim #{idx + 1}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-midnight-900 mt-2 leading-snug">
                    {arg.claim}
                  </h4>
                </div>

                {arg.evidenceOrBasis && (
                  <div className="pt-2">
                    <span className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Evidentiary Basis:
                    </span>
                    <p className="text-xs font-sans text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {arg.evidenceOrBasis}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Counter-Argument Defense */}
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-600 border border-gold-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Defense / Counter-Argument
                </span>

                <div className="pt-2">
                  <span className="block text-[11px] font-sans font-bold uppercase tracking-wider text-gold-600 mb-1">
                    Viable Response Basis:
                  </span>
                  <p className="text-xs font-sans text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {arg.counterArgument || 'No explicit counter-argument extracted from the record.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
