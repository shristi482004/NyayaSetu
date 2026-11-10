import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { documentApi } from '../api/documentApi';
import { analysisApi } from '../api/analysisApi';
import { AlertBanner } from '../components/common/AlertBanner';
import { ArrowUpRightBadge } from '../components/common/BrandGraphics';

// Analysis Tabs
import { SummaryTab } from '../components/analysis/SummaryTab';
import { FlowchartTab } from '../components/analysis/FlowchartTab';
import { FaqsTab } from '../components/analysis/FaqsTab';
import { TimelineTab } from '../components/analysis/TimelineTab';
import { ArgumentMapTab } from '../components/analysis/ArgumentMapTab';

export const AnalysisPage = () => {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const { isLawyer, isAdmin } = useAuth();

  const [document, setDocument] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const isLawyerOrAdmin = isLawyer || isAdmin;

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // 1. Fetch document metadata
      const docRes = await documentApi.getDocument(docId);
      if (!docRes.success || !docRes.data) {
        setError('Document not found or access denied.');
        return;
      }
      setDocument(docRes.data.document);

      // 2. Fetch or trigger analysis
      try {
        const analysisRes = await analysisApi.getAnalysis(docId);
        if (analysisRes.success && analysisRes.data) {
          setAnalysis(analysisRes.data);
          return;
        }
      } catch (err) {
        // 404 indicates analysis hasn't been generated yet
        if (err.response?.status === 404) {
          await triggerAnalysis();
        } else {
          throw err;
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to load document analysis.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerAnalysis = async () => {
    try {
      setIsGenerating(true);
      const res = await analysisApi.initiateAnalysis(docId);
      if (res.success && res.data) {
        setAnalysis(res.data);
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setError('Document text extraction is still in progress. Please poll again in a few moments.');
      } else if (status === 422) {
        setError('Document text extraction failed. Analysis cannot be generated.');
      } else {
        setError(err.response?.data?.message || 'Could not initiate AI analysis.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [docId]);

  const tabs = [
    { id: 'summary', label: 'Summary & Facts' },
    { id: 'flowchart', label: 'Procedural Flowchart' },
    { id: 'faqs', label: 'Legal FAQs' },
    { id: 'timeline', label: 'Timeline & Actions' },
    ...(isLawyerOrAdmin ? [{ id: 'arguments', label: 'Argument Map (Lawyer)' }] : []),
  ];

  return (
    <div className="min-h-screen bg-pale-200 flex flex-col justify-between selection:bg-midnight-900 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Navigation Breadcrumb & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-sans font-semibold text-slate-600">
              <Link to="/dashboard" className="hover:text-midnight-900 transition-colors">
                &larr; Back to Library
              </Link>
              <span>/</span>
              <span className="font-mono text-midnight-900">Legal Intelligence Analysis</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-midnight-900 truncate max-w-2xl">
              {document?.originalName || 'Document Analysis'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/documents/${docId}/chat`}
              className="px-5 py-2.5 rounded-full bg-midnight-900 hover:bg-slate-800 text-white text-xs font-sans font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 group"
            >
              <span>Launch Grounded Q&A</span>
              <ArrowUpRightBadge className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>

        {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

        {/* Loading and In-Progress States */}
        {isLoading || isGenerating ? (
          <div className="p-16 text-center rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-4">
            <div className="w-12 h-12 rounded-xl bg-midnight-900 text-gold-400 mx-auto flex items-center justify-center animate-pulse border border-slate-700">
              <span className="font-mono text-sm font-bold">AI</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-midnight-900">
              {isGenerating
                ? 'Synthesizing plain-language summary and procedural flowcharts...'
                : 'Loading document analysis...'}
            </h3>
            <p className="text-xs font-sans text-slate-600 max-w-sm mx-auto">
              Extracting legal issues, key dates, parties, and procedural obligations.
            </p>
          </div>
        ) : !analysis ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-4">
            <h3 className="text-lg font-serif font-bold text-midnight-900">
              Analysis Not Generated
            </h3>
            <p className="text-xs font-sans text-slate-600 max-w-sm mx-auto">
              Document text has been extracted, but structured AI analysis has not yet been initiated.
            </p>
            <button
              onClick={triggerAnalysis}
              className="px-6 py-2.5 rounded-full bg-midnight-900 hover:bg-slate-800 text-white text-xs font-sans font-semibold uppercase tracking-wider shadow-sm"
            >
              Initiate Legal Analysis
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation Pill Bar */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-white border border-slate-300 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4 rounded-lg text-xs font-sans font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-midnight-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-midnight-900 hover:bg-pale-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Tab View */}
            <div className="transition-all">
              {activeTab === 'summary' && <SummaryTab summary={analysis.summary} />}
              {activeTab === 'flowchart' && <FlowchartTab flowchart={analysis.flowchart} />}
              {activeTab === 'faqs' && <FaqsTab faqs={analysis.faqs} />}
              {activeTab === 'timeline' && (
                <TimelineTab
                  timeline={analysis.timeline}
                  actionItems={analysis.actionItems}
                />
              )}
              {activeTab === 'arguments' && (
                <ArgumentMapTab
                  argumentMap={analysis.arguments}
                  isLawyerOrAdmin={isLawyerOrAdmin}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

