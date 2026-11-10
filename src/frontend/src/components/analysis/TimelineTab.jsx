import React from 'react';

export const TimelineTab = ({ timeline, actionItems }) => {
  const getPriorityBadge = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-gold-500/10 text-gold-600 border-gold-500/30';
      case 'low':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Items Cards */}
      {actionItems && actionItems.length > 0 && (
        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xl font-serif font-bold text-midnight-900">
                Action Items & Obligations
              </h3>
              <p className="text-xs font-sans text-slate-600 mt-0.5">
                Critical tasks, compliance deadlines, and responsible entities extracted from text.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-midnight-900 text-white font-semibold">
              {actionItems.length} Tasks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {actionItems.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-pale-100 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(
                      item.priority
                    )}`}
                  >
                    Priority: {item.priority || 'Standard'}
                  </span>
                  {item.deadline && (
                    <span className="text-xs font-semibold text-gold-600 font-mono">
                      {item.deadline}
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm font-sans font-semibold text-midnight-900 leading-snug">
                  {item.action}
                </p>

                {item.responsibleParty && (
                  <div className="text-[11px] font-sans text-slate-600 border-t border-slate-200 pt-2 flex items-center justify-between">
                    <span>Responsible:</span>
                    <span className="font-semibold text-midnight-900">{item.responsibleParty}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chronological Vertical Timeline */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-midnight-900">
            Chronological Timeline
          </h3>
          <p className="text-xs font-sans text-slate-600 mt-0.5">
            Sequential historical and contractual events leading up to this legal action.
          </p>
        </div>

        {(!timeline || timeline.length === 0) ? (
          <p className="text-xs font-sans text-slate-500 italic">No timeline events recorded.</p>
        ) : (
          <div className="relative pl-6 md:pl-8 border-l-2 border-slate-300 space-y-8 my-4">
            {timeline.map((event, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node Bullet */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-midnight-900 border-4 border-white ring-2 ring-slate-300"></div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-midnight-900">
                      {event.date || 'Undated Event'}
                    </span>
                    {event.sourcePage && (
                      <span className="px-2 py-0.5 rounded bg-pale-200 text-slate-700 border border-slate-300 font-mono text-[10px]">
                        Page {event.sourcePage}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-sans font-semibold text-midnight-900">
                    {event.event}
                  </h4>
                  {event.description && (
                    <p className="text-xs font-sans text-slate-600 leading-relaxed max-w-2xl">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
