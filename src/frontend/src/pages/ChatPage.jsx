import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { documentApi } from '../api/documentApi';
import { chatApi } from '../api/chatApi';
import { AlertBanner } from '../components/common/AlertBanner';

export const ChatPage = () => {
  const { id: docId } = useParams();

  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadDocumentAndHistory = async () => {
    try {
      setIsLoading(true);
      setError('');

      const docRes = await documentApi.getDocument(docId);
      if (docRes.success && docRes.data) {
        setDocument(docRes.data.document);
      }

      const historyRes = await chatApi.getChatHistory(docId);
      if (historyRes.success && historyRes.data) {
        setMessages(historyRes.data);
      }
    } catch (err) {
      setError('Unable to load document chat session. Please verify server connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocumentAndHistory();
  }, [docId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (questionToSend) => {
    const q = (questionToSend || inputQuestion).trim();
    if (!q || isSending) return;

    setError('');
    setInputQuestion('');
    setIsSending(true);

    // Optimistically add user message
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      senderRole: 'user',
      content: q,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await chatApi.askQuestion(docId, q);

      if (res.success && res.data) {
        const assistantMsg = {
          _id: `assistant-${Date.now()}`,
          senderRole: 'assistant',
          content: res.data.answer,
          citedPages: res.data.citedPages || [],
          confidence: res.data.confidence || 'High',
          isUnknown: res.data.isUnknown || false,
          disclaimer: res.data.disclaimer,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setError(res.message || 'Failed to receive a response from the AI assistant.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error querying document. Please ensure the AI processing service is active.';
      setError(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    'What are the primary obligations under this document?',
    'What is the notice period or deadline for response?',
    'What penalties or liquidated damages are demanded?',
    'What dispute resolution mechanism or court is specified?',
  ];

  return (
    <div className="min-h-screen bg-pale-200 flex flex-col justify-between selection:bg-midnight-900 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Header & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-sans font-semibold text-slate-600">
              <Link to="/dashboard" className="hover:text-midnight-900 transition-colors">
                &larr; Library
              </Link>
              <span>/</span>
              <Link to={`/documents/${docId}/analysis`} className="hover:text-midnight-900 transition-colors">
                Analysis View
              </Link>
              <span>/</span>
              <span className="font-mono text-midnight-900">Grounded Q&A Chat</span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-midnight-900 truncate max-w-xl">
              {document?.originalName || 'Document Q&A'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-midnight-900 text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow-sm border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>100% Document Grounded</span>
            </span>
          </div>
        </div>

        {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

        {/* Chat Thread Container */}
        <div className="flex-grow min-h-[480px] p-6 rounded-2xl bg-white border border-slate-300 shadow-subtle flex flex-col justify-between space-y-6">
          {isLoading ? (
            <div className="my-auto text-center space-y-2 py-12">
              <span className="font-mono text-sm text-slate-600">Loading conversation history...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="my-auto text-center space-y-4 py-12">
              <div className="w-14 h-14 rounded-xl bg-midnight-900 text-gold-400 mx-auto flex items-center justify-center font-mono font-bold text-lg shadow-sm border border-slate-700">
                Q&A
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-serif font-bold text-midnight-900">
                  Ask Any Question About This Document
                </h3>
                <p className="text-xs font-sans text-slate-600 leading-relaxed">
                  Answers are derived strictly from the text extracted by PyMuPDF and Tesseract OCR. Every response includes verifiable page citations.
                </p>
              </div>

              {/* Quick suggestions */}
              <div className="pt-4 max-w-lg mx-auto flex flex-wrap gap-2 justify-center">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="text-left text-xs px-3.5 py-2 rounded-lg bg-pale-100 hover:bg-pale-200 border border-slate-300 text-midnight-900 transition-colors font-sans"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto max-h-[580px] pr-2">
              {messages.map((msg, index) => {
                const isUser = msg.senderRole === 'user';
                return (
                  <div
                    key={msg._id || index}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-2xl p-5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm space-y-2.5 ${
                        isUser
                          ? 'bg-midnight-900 text-white rounded-tr-sm'
                          : 'bg-pale-100 text-midnight-900 border border-slate-300 rounded-tl-sm'
                      }`}
                    >
                      <div className="font-sans font-medium">{msg.content}</div>

                      {/* Assistant-specific metadata: Citations and Uncertainty */}
                      {!isUser && (
                        <div className="pt-2 border-t border-slate-200 space-y-2">
                          {/* Cited Pages */}
                          {msg.citedPages && msg.citedPages.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                              <span className="text-slate-600">Source Pages:</span>
                              {msg.citedPages.map((p, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="px-2 py-0.5 rounded bg-midnight-900 text-white font-bold"
                                >
                                  Page {p}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Uncertainty notice */}
                          {msg.isUnknown && (
                            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                              <span className="font-mono font-bold text-amber-700 mt-0.5">[Notice]</span>
                              <span>
                                The information requested is not stated in the uploaded document text. The assistant does not extrapolate unsupplied legal facts.
                              </span>
                            </div>
                          )}

                          {/* Legal informational tag */}
                          <div className="text-[10px] font-sans text-slate-500 italic">
                            Informational document assistance only. Does not constitute formal legal counsel.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                      {isUser ? 'You' : 'NyayaSetu Assistant'}
                    </span>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex flex-col items-start space-y-1">
                  <div className="p-4 rounded-xl bg-pale-100 border border-slate-300 text-xs font-mono text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-midnight-900 animate-ping"></span>
                    <span>Retrieving document passages and synthesizing response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Box */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about this document (e.g. 'What is the notice period?')..."
                disabled={isSending}
                className="flex-grow px-5 py-3 rounded-xl bg-white border border-slate-300 text-midnight-900 text-xs md:text-sm focus:outline-none focus:border-midnight-900 focus:ring-1 focus:ring-midnight-900 placeholder:text-slate-400 transition-all font-sans shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isSending || !inputQuestion.trim()}
                className="px-6 py-3 rounded-xl bg-midnight-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all shadow-sm shrink-0 flex items-center gap-1.5"
              >
                <span>{isSending ? 'Sending...' : 'Ask'}</span>
              </button>
            </div>
            <div className="mt-2 text-[10px] font-sans text-slate-500 flex items-center justify-between">
              <span>Press Enter to send question.</span>
              <span>Constrained to uploaded document record.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

