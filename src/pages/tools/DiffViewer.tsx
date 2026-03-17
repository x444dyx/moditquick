import React, { useState, useEffect, useMemo } from 'react';
import * as diff from 'diff';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Copy, Check, Trash2, ArrowRightLeft, Layout, Columns, Split, Merge, Download, Save } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';

export default function DiffViewer() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [diffResult, setDiffResult] = useState<diff.Change[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const changes = diff.diffLines(original, modified);
    setDiffResult(changes);
  }, [original, modified]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(modified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadModified = () => {
    const blob = new Blob([modified], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged-result-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setOriginal('');
    setModified('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Diff / Merge Viewer</h1>
          <p className="text-white/60">Compare two pieces of text and see line-level differences instantly.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex p-1 bg-black/20 rounded-2xl border border-white/5">
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'split' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Columns size={14} />
              SPLIT
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'unified' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Layout size={14} />
              UNIFIED
            </button>
          </div>
          <button 
            onClick={clear}
            className="glass p-3 rounded-full text-white/40 hover:text-red-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
        {/* Original Editor */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
              <ArrowRightLeft size={14} />
              Original Text
            </div>
          </div>
          <div className="flex-1 glass rounded-[40px] overflow-hidden border border-white/5 relative bg-black/20">
            <CodeEditor
              value={original}
              onChange={(v) => setOriginal(v || '')}
              language="text"
            />
          </div>
        </div>

        {/* Modified Editor */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-emerald-400 uppercase tracking-widest text-xs font-bold">
              <Merge size={14} />
              Modified Text
            </div>
            <div className="flex gap-3">
              <button 
                onClick={copyToClipboard}
                className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
              <button 
                onClick={downloadModified}
                className="text-white/20 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <Download size={14} />
                DOWNLOAD
              </button>
            </div>
          </div>
          <div className="flex-1 glass rounded-[40px] overflow-hidden border border-white/5 relative bg-black/20">
            <CodeEditor
              value={modified}
              onChange={(v) => setModified(v || '')}
              language="text"
            />
          </div>
        </div>
      </div>

      {/* Diff Result Area */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold px-2">
          <GitCompare size={14} />
          Comparison Result
        </div>
        
        <div className="glass rounded-[40px] border border-white/5 bg-black/20 overflow-hidden">
          <div className="p-8 font-mono text-sm overflow-auto max-h-[600px] leading-relaxed">
            {diffResult.length > 0 && (original || modified) ? (
              <div className="space-y-0.5">
                {diffResult.map((part, i) => (
                  <div 
                    key={i}
                    className={`whitespace-pre-wrap px-4 py-0.5 rounded-sm ${
                      part.added ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500' :
                      part.removed ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500 line-through' :
                      'text-white/40 border-l-4 border-transparent'
                    }`}
                  >
                    {part.value}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-white/10 text-center">
                <GitCompare size={64} className="mb-4" />
                <p className="text-lg font-medium">No differences to show</p>
                <p className="text-sm">Enter text in both panels to start comparison</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
