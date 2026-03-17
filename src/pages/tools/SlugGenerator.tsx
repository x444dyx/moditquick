import React, { useState, useEffect } from 'react';
import slugify from 'slugify';
import { motion } from 'framer-motion';
import { Link, Copy, Check, Trash2, Settings, Sparkles, Globe, AlertCircle } from 'lucide-react';

export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    lower: true,
    strict: true,
    replacement: '-',
    trim: true,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (input) {
      handleSlugify();
    } else {
      setOutput('');
    }
  }, [input, options]);

  const handleSlugify = () => {
    try {
      const slug = slugify(input, options);
      setOutput(slug);
    } catch (err) {
      console.error('Slugification failed:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Slug Generator</h1>
          <p className="text-white/60">Create SEO-friendly, URL-safe slugs from any text instantly locally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Settings size={20} />
              <span>Slug Options</span>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer hover:border-white/10 transition-all group">
                <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">Lowercase</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={options.lower} 
                    onChange={() => setOptions(prev => ({ ...prev, lower: !prev.lower }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer hover:border-white/10 transition-all group">
                <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">Strict Mode</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={options.strict} 
                    onChange={() => setOptions(prev => ({ ...prev, strict: !prev.strict }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2">Separator</label>
                <div className="flex gap-2">
                  {['-', '_', '.'].map((sep) => (
                    <button
                      key={sep}
                      onClick={() => setOptions(prev => ({ ...prev, replacement: sep }))}
                      className={`flex-1 py-2 rounded-xl border transition-all font-mono ${
                        options.replacement === sep 
                          ? 'bg-primary/10 border-primary text-white' 
                          : 'bg-black/20 border-white/5 text-white/40 hover:border-white/10'
                      }`}
                    >
                      {sep}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setInput('')}
              className="w-full py-3 rounded-2xl border border-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Clear Input
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                <Globe size={14} />
                Input Text
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter article title or text to slugify..."
              className="w-full glass rounded-[32px] p-8 min-h-[150px] focus:outline-none focus:border-primary/50 transition-colors resize-none text-xl font-medium"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-bold">
                <Link size={14} />
                Generated Slug
              </div>
              {output && (
                <button 
                  onClick={copyToClipboard}
                  className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'COPIED' : 'COPY SLUG'}
                </button>
              )}
            </div>
            <div className="w-full glass rounded-[32px] p-8 min-h-[120px] bg-black/20 border border-white/5 flex items-center">
              <div className="w-full font-mono text-xl break-all text-white/80">
                {output || <span className="text-white/10 italic">Waiting for input...</span>}
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-sm font-bold">SEO Ready</p>
              <p className="text-xs text-white/40">Clean, readable URLs improve search engine rankings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
