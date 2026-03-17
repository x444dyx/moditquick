import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, Copy, Check, Trash2, Hash, FileText, Type, List, Sparkles } from 'lucide-react';

export default function WordCounter() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    lines: 0,
    sentences: 0,
    readingTime: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const text = input.trim();
    if (!text) {
      setStats({ words: 0, chars: 0, charsNoSpaces: 0, lines: 0, sentences: 0, readingTime: 0 });
      return;
    }

    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const lines = input.split(/\r\n|\r|\n/).length;
    const sentences = text.split(/[\.\!\?]+/).filter(s => s.trim().length > 0).length;
    const readingTime = Math.ceil(words / 200); // Average 200 wpm

    setStats({ words, chars, charsNoSpaces, lines, sentences, readingTime });
  }, [input]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { label: 'Words', value: stats.words, icon: FileText, color: 'text-primary' },
    { label: 'Characters', value: stats.chars, icon: Hash, color: 'text-emerald-400' },
    { label: 'Sentences', value: stats.sentences, icon: List, color: 'text-amber-400' },
    { label: 'Lines', value: stats.lines, icon: AlignLeft, color: 'text-violet-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Word & Character Counter</h1>
          <p className="text-white/60">Analyze your text with real-time statistics and reading time estimates locally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-white/90">{stat.value.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
              <Type size={14} />
              Input Text
            </div>
            <div className="flex gap-4">
              <button 
                onClick={copyToClipboard}
                className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
              <button 
                onClick={() => setInput('')}
                className="text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="w-full glass rounded-[40px] p-8 min-h-[400px] focus:outline-none focus:border-primary/50 transition-colors resize-none text-lg leading-relaxed bg-white/5"
          />
        </div>

        {/* Detailed Stats Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[40px] border border-white/10 bg-white/5 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold px-2">
                <Sparkles size={14} />
                Detailed Analysis
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-sm text-white/40">Characters (no spaces)</span>
                  <span className="font-mono font-bold text-white/80">{stats.charsNoSpaces.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-sm text-white/40">Estimated Reading Time</span>
                  <span className="font-mono font-bold text-primary">{stats.readingTime} min</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 space-y-2">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Pro Tip</p>
              <p className="text-xs text-white/60 leading-relaxed">
                The average adult reads at about 200 words per minute. This estimate helps you gauge content length for your audience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
