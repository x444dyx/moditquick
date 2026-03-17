import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { motion } from 'framer-motion';
import { Hash, Copy, Check, Trash2, Search, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({ md5: '', sha256: '' });
  const [compareHash, setCompareHash] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (input) {
      setHashes({
        md5: CryptoJS.MD5(input).toString(),
        sha256: CryptoJS.SHA256(input).toString(),
      });
    } else {
      setHashes({ md5: '', sha256: '' });
    }
  }, [input]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const isMatch = (generated: string) => {
    if (!compareHash) return null;
    return generated.toLowerCase() === compareHash.trim().toLowerCase();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Hash Generator & Checker</h1>
          <p className="text-white/60">Generate MD5 and SHA256 hashes from text and verify them locally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between px-2">
              <label className="text-sm font-medium text-white/40 uppercase tracking-widest">Input Text</label>
              <button 
                onClick={() => setInput('')}
                className="text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="w-full glass rounded-2xl p-4 min-h-[150px] focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <div className="glass p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold px-2">
              <Search size={18} />
              <span>Hash Checker</span>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/40 px-2 uppercase tracking-widest">Compare with Hash</label>
              <input
                type="text"
                value={compareHash}
                onChange={(e) => setCompareHash(e.target.value)}
                placeholder="Paste a hash to compare..."
                className="w-full glass rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          <div className="space-y-4">
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest px-2">Generated Hashes</span>
            
            {/* MD5 */}
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">MD5</span>
                <button 
                  onClick={() => copyToClipboard(hashes.md5, 'md5')}
                  className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  {copied === 'md5' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'md5' ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm break-all">
                {hashes.md5 || '—'}
              </div>
              {compareHash && hashes.md5 && (
                <div className={`flex items-center gap-2 text-xs font-bold ${isMatch(hashes.md5) ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isMatch(hashes.md5) ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {isMatch(hashes.md5) ? 'MATCHES' : 'NO MATCH'}
                </div>
              )}
            </div>

            {/* SHA256 */}
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">SHA256</span>
                <button 
                  onClick={() => copyToClipboard(hashes.sha256, 'sha256')}
                  className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  {copied === 'sha256' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'sha256' ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm break-all">
                {hashes.sha256 || '—'}
              </div>
              {compareHash && hashes.sha256 && (
                <div className={`flex items-center gap-2 text-xs font-bold ${isMatch(hashes.sha256) ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isMatch(hashes.sha256) ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {isMatch(hashes.sha256) ? 'MATCHES' : 'NO MATCH'}
                </div>
              )}
            </div>
          </div>

          {!input && (
            <div className="p-8 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-white/10 text-center">
              <Hash size={48} className="mb-4" />
              <p className="font-medium">Enter text to see hash results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
