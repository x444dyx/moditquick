import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Copy, Check, RefreshCw } from 'lucide-react';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      setOutput('Error encoding URL');
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      setOutput('Error decoding URL');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">URL Encoder / Decoder</h1>
        <p className="text-white/60">Safely encode or decode URLs for web use.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/40 px-2">Input URL / Text</label>
          <div className="glass rounded-3xl overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your URL or text here..."
              className="w-full h-40 bg-transparent p-6 font-mono text-sm focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={encode} className="btn-primary flex-1">Encode</button>
          <button onClick={decode} className="glass px-12 py-3 rounded-full font-medium hover:bg-white/10 transition-colors flex-1">Decode</button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-medium text-white/40">Result</label>
            {output && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-light transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div className="glass rounded-3xl p-6 min-h-[100px] font-mono text-sm break-all">
            {output || <span className="text-white/10">Result will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
