import React, { useState, useRef } from 'react';
import { documentApi } from '../../api/documentApi';
import { AlertBanner } from '../common/AlertBanner';
import { ArrowUpRightBadge } from '../common/BrandGraphics';

const MAX_FILE_SIZE = 26214400; // 25 MB

export const FileUploadZone = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file) => {
    setError('');
    setSuccessMsg('');

    // Format check
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Invalid file format. Only PDF documents (.pdf) are supported.');
      return;
    }

    // Size check
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the statutory 25MB limit.`);
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const res = await documentApi.uploadDocument(file, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      if (res.success) {
        setSuccessMsg(`Document "${file.name}" uploaded successfully. Text extraction queued.`);
        if (onUploadSuccess) {
          onUploadSuccess(res.data);
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(res.message || 'Document upload failed.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to upload document. Please ensure the server is accessible.';
      setError(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {successMsg && <AlertBanner type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`p-8 md:p-12 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-midnight-900 bg-pale-100 shadow-panel'
            : 'border-slate-300 bg-white hover:border-midnight-900 hover:bg-pale-100/50 shadow-subtle'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="max-w-md mx-auto space-y-4">
          {/* Vector Document Glyph */}
          <div className="w-14 h-14 rounded-xl bg-midnight-900 text-gold-400 mx-auto flex items-center justify-center shadow-sm border border-slate-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-7 h-7">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold text-midnight-900">
              Drag and drop your legal PDF here
            </h3>
            <p className="text-xs font-sans text-slate-600 mt-1">
              or click anywhere to browse documents from your device
            </p>
          </div>

          {/* Action Button & Metadata */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-full bg-midnight-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-sans font-semibold uppercase tracking-wider transition-all flex items-center gap-2 group shadow-sm"
            >
              <span>{isUploading ? 'Uploading PDF...' : 'Select PDF File'}</span>
              {!isUploading && <ArrowUpRightBadge className="w-4 h-4 text-white" />}
            </button>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="pt-2 max-w-xs mx-auto space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-midnight-900 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Format Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-600">
            <span className="px-2.5 py-1 rounded-full bg-pale-200 border border-slate-300">
              Format: PDF Only
            </span>
            <span className="px-2.5 py-1 rounded-full bg-pale-200 border border-slate-300">
              Max Size: 25 MB
            </span>
            <span className="px-2.5 py-1 rounded-full bg-pale-200 border border-slate-300">
              PyMuPDF + Tesseract OCR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

