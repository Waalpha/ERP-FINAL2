import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Link as LinkIcon, Sparkles, Check, AlertCircle } from 'lucide-react';

interface LogoUploaderProps {
  currentLogoUrl?: string;
  onLogoChange: (logoUrl: string) => void;
  entityName?: string;
  label?: string;
  sublabel?: string;
  compact?: boolean;
}

// Preset school crests & organizational emblems for quick-start
const compressImage = (file: File, maxWidth: number, maxHeight: number, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(img.src);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      resolve(canvas.toDataURL(mimeType, quality));
    };
    img.onerror = reject;

    reader.readAsDataURL(file);
  });
};

const SAMPLE_LOGOS = [
  {
    name: 'Academic Shield (Gold & Navy)',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=160&auto=format&fit=crop&q=80'
  },
  {
    name: 'Heritage Torch Emblem',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80'
  },
  {
    name: 'Modern University Crest',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=160&auto=format&fit=crop&q=80'
  }
];

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoUrl,
  onLogoChange,
  entityName = 'Institution',
  label = 'Official Logo & School Crest',
  sublabel = 'Recommended format: Transparent PNG, SVG, or high-res JPG (Max 5MB). Used on report cards, receipts & circulars.',
  compact = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 10MB. Please choose a smaller file.');
      return;
    }

    try {
      // Automatically compress and resize to max 400x400 for optimal storage & Firestore persistence
      const compressedDataUrl = await compressImage(file, 400, 400, 0.85);
      onLogoChange(compressedDataUrl);
    } catch {
      setErrorMsg('Failed to process image. Please try another file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onLogoChange(urlInput.trim());
      setIsUrlMode(false);
      setUrlInput('');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLogoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <label className="block font-semibold text-slate-700 text-xs">{label}</label>
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
            {currentLogoUrl ? (
              <img src={currentLogoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
            ) : (
              <ImageIcon className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>{currentLogoUrl ? 'Change Logo' : 'Upload Logo'}</span>
              </button>
              {currentLogoUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Logo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block font-bold text-slate-900 text-xs flex items-center space-x-1.5">
            <ImageIcon className="h-4 w-4 text-indigo-600" />
            <span>{label}</span>
          </label>
          {sublabel && <p className="text-[11px] text-slate-500 mt-0.5">{sublabel}</p>}
        </div>
        {currentLogoUrl && (
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
            <Check className="h-3 w-3" />
            <span>Logo Active</span>
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Upload Dropzone & Live Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Live Logo Preview Frame */}
        <div className="sm:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative group min-h-[140px]">
          {currentLogoUrl ? (
            <div className="space-y-2 w-full flex flex-col items-center">
              <div className="h-20 w-20 rounded-2xl bg-white shadow-xs border border-slate-200 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={currentLogoUrl}
                  alt={`${entityName} Logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-[11px] font-bold text-slate-800 truncate max-w-full">
                {entityName} Crest
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center space-x-1 text-[10px] font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove Logo</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-indigo-900 text-white font-black text-2xl flex items-center justify-center shadow-xs border-2 border-indigo-700">
                {entityName.charAt(0) || 'D'}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Default Lettermark</span>
            </div>
          )}
        </div>

        {/* Dropzone Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`sm:col-span-2 border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
            className="hidden"
          />

          <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-5 w-5" />
          </div>

          <div className="text-xs font-bold text-slate-800">
            {isDragging ? 'Drop logo image here' : 'Click to upload logo or drag & drop'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            PNG, JPG, SVG, WebP up to 5MB
          </div>

          <div className="mt-3 flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold transition-colors"
            >
              Browse Files
            </button>
            <button
              type="button"
              onClick={() => setIsUrlMode(!isUrlMode)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-colors"
            >
              <LinkIcon className="h-3 w-3" />
              <span>Paste URL</span>
            </button>
          </div>
        </div>
      </div>

      {/* URL Input Bar */}
      {isUrlMode && (
        <form onSubmit={handleApplyUrl} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in">
          <label className="block text-[11px] font-bold text-slate-700">Enter Public Logo Image URL</label>
          <div className="flex items-center space-x-2">
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setIsUrlMode(false)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sample Crests Presets */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Preset Template Crests</span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_LOGOS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onLogoChange(sample.url)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 flex items-center space-x-2 text-left transition-all group"
            >
              <img src={sample.url} alt={sample.name} className="h-7 w-7 rounded-lg object-cover flex-shrink-0" />
              <span className="text-[10px] font-semibold text-slate-700 group-hover:text-indigo-900 truncate">
                {sample.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface FaviconUploaderProps {
  currentFaviconUrl?: string;
  onFaviconChange: (faviconUrl: string) => void;
  label?: string;
  sublabel?: string;
}

export const FaviconUploader: React.FC<FaviconUploaderProps> = ({
  currentFaviconUrl,
  onFaviconChange,
  label = 'Browser Tab Favicon (ICO / PNG)',
  sublabel = 'Recommended square image (32x32px or 64x64px ICO, PNG or SVG) displayed in browser tabs.'
}) => {
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (ICO, PNG, SVG)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Favicon file exceeds 10MB limit.');
      return;
    }
    try {
      // Automatically compress and resize to 64x64 square favicon
      const compressedFavicon = await compressImage(file, 64, 64, 0.9);
      onFaviconChange(compressedFavicon);
    } catch {
      setErrorMsg('Failed to process favicon file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onFaviconChange(urlInput.trim());
      setIsUrlMode(false);
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-slate-800">{label}</label>
          <p className="text-[11px] text-slate-500">{sublabel}</p>
        </div>
        {currentFaviconUrl && (
          <button
            type="button"
            onClick={() => onFaviconChange('')}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
          >
            <Trash2 className="h-3 w-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4 p-3 bg-white border border-slate-200 rounded-2xl">
        <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
          {currentFaviconUrl ? (
            <img src={currentFaviconUrl} alt="Favicon" className="w-6 h-6 object-contain" />
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
            >
              Upload Favicon
            </button>
            <button
              type="button"
              onClick={() => setIsUrlMode(!isUrlMode)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1 transition"
            >
              <LinkIcon className="w-3 h-3" />
              <span>URL</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {errorMsg && (
        <p className="text-[11px] font-semibold text-rose-600 flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>{errorMsg}</span>
        </p>
      )}

      {isUrlMode && (
        <form onSubmit={handleApplyUrl} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <input
            type="url"
            placeholder="https://example.com/favicon.ico"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsUrlMode(false)}
              className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Apply URL
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
