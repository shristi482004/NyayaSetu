import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { documentApi } from '../../api/documentApi';
import { AlertBanner } from '../common/AlertBanner';
import { ArrowUpRightBadge } from '../common/BrandGraphics';

export const DocumentList = ({ refreshTrigger, onDocumentDeleted }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const pollTimerRef = useRef(null);

  const fetchDocuments = async () => {
    try {
      const res = await documentApi.listDocuments();
      if (res.success && res.data) {
        setDocuments(res.data);
      }
    } catch (err) {
      setError('Unable to load document library. Please verify server connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  // Automatic polling if any document is extracting
  useEffect(() => {
    const hasPending = documents.some(
      (doc) => doc.status === 'uploaded' || doc.status === 'extracting'
    );

    if (hasPending) {
      pollTimerRef.current = setTimeout(() => {
        fetchDocuments();
      }, 3000);
    }

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [documents]);

  const handleDelete = async (docId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}" and all associated analyses?`)) {
      return;
    }

    try {
      setDeletingId(docId);
      const res = await documentApi.deleteDocument(docId);
      if (res.success) {
        setDocuments((prev) => prev.filter((d) => d._id !== docId));
        if (onDocumentDeleted) onDocumentDeleted(docId);
      }
    } catch (err) {
      setError('Failed to delete document. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredDocs = documents.filter((doc) =>
    (doc.originalName || doc.fileName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Ready for Analysis</span>
          </span>
        );
      case 'extracting':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-midnight-900 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-midnight-900 animate-pulse"></span>
            <span>Extracting Text...</span>
          </span>
        );
      case 'uploaded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span>Queued</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span>Extraction Failed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs bg-slate-200 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      {/* Header and Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-midnight-900">
            Document Library
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {documents.length} legal document{documents.length === 1 ? '' : 's'} managed in your workspace
          </p>
        </div>

        {documents.length > 0 && (
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by document title..."
              className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none focus:border-midnight-900 text-midnight-900 placeholder:text-slate-400 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Table / List View */}
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-300 shadow-subtle">
          <div className="text-sm font-mono text-slate-600 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-midnight-900 animate-ping"></span>
            <span>Loading document library...</span>
          </div>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-300 shadow-subtle space-y-3">
          <div className="w-12 h-12 rounded-xl bg-pale-200 text-midnight-900 mx-auto flex items-center justify-center border border-slate-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3 className="text-base font-serif font-bold text-midnight-900">No documents found</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            {searchQuery
              ? 'No documents match your search query.'
              : 'Upload a legal notice, contract, or judgment above to begin automated extraction.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-300 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-pale-200 border-b border-slate-300 text-[11px] font-bold uppercase tracking-wider text-midnight-900">
                  <th className="py-3.5 px-6">Document Title</th>
                  <th className="py-3.5 px-4">Uploaded</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Pages</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDocs.map((doc) => (
                  <tr key={doc._id} className="hover:bg-pale-100/70 transition-colors">
                    {/* Document Title */}
                    <td className="py-4 px-6 font-medium text-midnight-900">
                      <div className="flex items-center gap-2.5 max-w-xs md:max-w-sm">
                        <span className="shrink-0 p-1.5 rounded-lg bg-pale-200 text-midnight-900 border border-slate-300">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M4 0h5.5v4H14v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6 1v3h3L10 1z" />
                          </svg>
                        </span>
                        <span className="truncate font-sans font-medium" title={doc.originalName || doc.fileName}>
                          {doc.originalName || doc.fileName}
                        </span>
                      </div>
                    </td>

                    {/* Upload Date */}
                    <td className="py-4 px-4 text-slate-600 font-sans">
                      {formatDate(doc.uploadDate || doc.createdAt)}
                    </td>

                    {/* File Size */}
                    <td className="py-4 px-4 font-mono text-slate-600">
                      {formatFileSize(doc.fileSize)}
                    </td>

                    {/* Page Count */}
                    <td className="py-4 px-4 font-mono text-slate-600">
                      {doc.pageCount ? `${doc.pageCount} page${doc.pageCount > 1 ? 's' : ''}` : 'Pending'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {getStatusBadge(doc.status)}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {doc.status === 'ready' && (
                          <>
                            <Link
                              to={`/documents/${doc._id}/analysis`}
                              className="px-3.5 py-1.5 rounded-full bg-midnight-900 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-1.5"
                            >
                              <span>Analysis</span>
                              <ArrowUpRightBadge className="w-3.5 h-3.5 text-white" />
                            </Link>

                            <Link
                              to={`/documents/${doc._id}/chat`}
                              className="px-3.5 py-1.5 rounded-full bg-pale-200 hover:bg-pale-300 text-midnight-900 text-xs font-semibold uppercase tracking-wider transition-colors border border-slate-300 inline-flex items-center gap-1"
                            >
                              <span>Q&A Chat</span>
                            </Link>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(doc._id, doc.originalName || doc.fileName)}
                          disabled={deletingId === doc._id}
                          className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-xs font-medium"
                          title="Delete Document"
                        >
                          {deletingId === doc._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
