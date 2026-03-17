import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Zap, 
  FileCode,
  AlertCircle
} from 'lucide-react';
import CodeEditor from './CodeEditor';
import { formatCode, minifyCode } from '../utils/formatter';

interface EditorShellProps {
  title: string;
  description: string;
  language: string;
  extension: string;
  initialValue?: string;
  onValueChange?: (value: string) => void;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  showPreview?: boolean;
  previewComponent?: (value: string) => React.ReactNode;
}

export default function EditorShell({ 
  title, 
  description, 
  language, 
  extension,
  initialValue = '',
  onValueChange,
  actions,
  children,
  showPreview = false,
  previewComponent
}: EditorShellProps) {
  const [code, setCode] = useState(initialValue);
  const [debouncedCode, setDebouncedCode] = useState(initialValue);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce code updates for preview to prevent lag
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code);
    }, 300);
    return () => clearTimeout(timer);
  }, [code]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    const newValue = value || '';
    setCode(newValue);
    if (onValueChange) onValueChange(newValue);
    
    // Basic validation
    if (language === 'json') {
      try {
        if (newValue.trim()) JSON.parse(newValue);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  }, [language, onValueChange]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const downloadFile = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modit-export.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, extension]);

  const handleBeautify = async () => {
    const formatted = await formatCode(code, language);
    setCode(formatted);
  };

  const handleMinify = () => {
    const minified = minifyCode(code, language);
    setCode(minified);
  };

  const preview = useMemo(() => {
    if (showPreview && previewComponent) {
      return previewComponent(debouncedCode);
    }
    return null;
  }, [showPreview, previewComponent, debouncedCode]);

  return (
    <div className={`max-w-7xl mx-auto px-6 py-12 space-y-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#07101F] p-6 overflow-auto' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-white/60">{description}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleBeautify}
            className="glass px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Sparkles size={16} className="text-primary" />
            Beautify
          </button>
          <button 
            onClick={handleMinify}
            className="glass px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Zap size={16} className="text-emerald-400" />
            Minify
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-2' : ''} gap-6 h-[700px]`}>
        {/* Editor Container */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white/40 uppercase tracking-widest">{language} Editor</span>
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                  <AlertCircle size={14} />
                  Invalid {language.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-light transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button 
                onClick={downloadFile}
                className="text-white/20 hover:text-white/60 transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white/20 hover:text-white/60 transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button 
                onClick={() => setCode('')}
                className="text-white/20 hover:text-red-400 transition-colors"
                title="Clear"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {/* Removed backdrop-blur from editor container for performance */}
          <div className="flex-1 bg-[#1e1e1e] rounded-[40px] overflow-hidden relative border border-white/5 shadow-2xl">
            <CodeEditor 
              value={code} 
              onChange={handleCodeChange} 
              language={language} 
            />
          </div>
        </div>

        {/* Preview Container */}
        {showPreview && (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Live Preview</span>
            </div>
            <div className="flex-1 glass rounded-[40px] overflow-hidden bg-white/5 border border-white/5 p-8 overflow-auto">
              {preview}
            </div>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
