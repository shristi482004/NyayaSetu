import React, { useState } from 'react';

export const FaqsTab = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-300 shadow-subtle">
        <p className="text-sm font-sans text-slate-600">No frequently asked questions generated for this document.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle">
        <h3 className="text-xl font-serif font-bold text-midnight-900">
          Document Frequently Asked Questions
        </h3>
        <p className="text-xs font-sans text-slate-600 mt-1">
          Common citizen questions generated from the text, with verifiable clause references.
        </p>

        <div className="mt-6 space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-pale-100 border border-slate-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-pale-200 transition-colors focus:outline-none"
              >
                <span className="text-sm md:text-base font-serif font-bold text-midnight-900">
                  {faq.question}
                </span>
                <span className="font-mono text-xs text-midnight-900 font-bold shrink-0">
                  {openIndex === idx ? '[-]' : '[+]'}
                </span>
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-200 space-y-3">
                  <p className="text-xs md:text-sm font-sans text-slate-700 leading-relaxed">
                    {faq.answer}
                  </p>
                  {faq.relevantClauseOrPage && (
                    <div className="pt-1">
                      <span className="inline-block px-3 py-1 rounded-full bg-midnight-900 text-white text-[11px] font-mono font-medium">
                        Reference: {faq.relevantClauseOrPage}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
