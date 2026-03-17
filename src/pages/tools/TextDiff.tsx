import React, { useState, useMemo } from 'react';
import { diffLines, Change } from 'diff';
import { motion } from 'framer-motion';
import { FileDiff, ArrowRight, CheckCircle2, Copy, Trash2 } from 'lucide-react';

export default function TextDiff() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const diff = useMemo(() => {
    if (!text1 && !text2) return [];
    return diffLines(text1, text2);
  }, [text1, text2]);

  const copyResult = () => {
    const result = diff.map(part => {
      const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
      return part.value.split('\n').filter(line => line).map(line => prefix + line).join('\n');
    }).join('\n');
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Text Diff Viewer</h1>
        <p className="text-white/60">Compare two blocks of text and see exactly what changed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Original Text</label>
            <button onClick={() => setText1('')} className="text-xs text-white/20 hover:text-white/40 flex items-center gap-1">
              <Trash2 size={12} /> Clear
            </button>
          </div>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Paste original text here..."
            className="w-full h-[300px] glass rounded-3xl p-6 font-mono text-sm focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Modified Text</label>
            <button onClick={() => setText2('')} className="text-xs text-white/20 hover:text-white/40 flex items-center gap-1">
              <Trash2 size={12} /> Clear
            </button>
          </div>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Paste modified text here..."
            className="w-full h-[300px] glass rounded-3xl p-6 font-mono text-sm focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
            <FileDiff size={14} />
            Comparison Result
          </label>
          {diff.length > 0 && (
            <button onClick={copyResult} className="text-xs text-primary hover:underline flex items-center gap-1">
              {isCopied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
              {isCopied ? 'Copied' : 'Copy Diff'}
            </button>
          )}
        </div>
        
        <div className="glass rounded-[40px] p-8 min-h-[200px] font-mono text-sm overflow-auto bg-black/20">
          {diff.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/10 py-12">
              <FileDiff size={48} className="mb-4" />
              <p>Enter text above to see differences</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {diff.map((part, index) => (
                <div
                  key={index}
                  className={`px-2 py-0.5 rounded ${
                    part.added ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500' :
                    part.removed ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' :
                    'text-white/60'
                  }`}
                >
                  <pre className="whitespace-pre-wrap">
                    {part.added ? '+ ' : part.removed ? '- ' : '  '}
                    {part.value}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
