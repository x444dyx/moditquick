import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, Copy, Check, Trash2, ArrowRightLeft, List, Sparkles } from 'lucide-react';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<string>('uppercase');
  const [copied, setCopied] = useState(false);

  const convert = (text: string, type: string) => {
    switch (type) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'sentence':
        return text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
      case 'title':
        return text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      case 'camel':
        return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
      case 'pascal':
        const camel = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        return camel.charAt(0).toUpperCase() + camel.slice(1);
      case 'snake':
        return text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('_') || '';
      case 'kebab':
        return text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('-') || '';
      default:
        return text;
    }
  };

  useEffect(() => {
    setOutput(convert(input, mode));
  }, [input, mode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modes = [
    { id: 'uppercase', name: 'UPPERCASE' },
    { id: 'lowercase', name: 'lowercase' },
    { id: 'sentence', name: 'Sentence case' },
    { id: 'title', name: 'Title Case' },
    { id: 'camel', name: 'camelCase' },
    { id: 'pascal', name: 'PascalCase' },
    { id: 'snake', name: 'snake_case' },
    { id: 'kebab', name: 'kebab-case' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Case Converter</h1>
          <p className="text-white/60">Transform text between different letter cases instantly locally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Modes Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Type size={20} />
              <span>Conversion Modes</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                    mode === m.id 
                      ? 'bg-primary/10 border-primary text-white' 
                      : 'bg-black/20 border-white/5 text-white/40 hover:border-white/10'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setInput('')}
              className="w-full py-3 rounded-2xl border border-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                  <List size={14} />
                  Input Text
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full glass rounded-[32px] p-8 min-h-[200px] focus:outline-none focus:border-primary/50 transition-colors resize-none text-lg leading-relaxed"
              />
            </div>

            {/* Output */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-bold">
                  <Sparkles size={14} />
                  Converted Result
                </div>
                {output && (
                  <button 
                    onClick={copyToClipboard}
                    className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'COPIED' : 'COPY RESULT'}
                  </button>
                )}
              </div>
              <div className="w-full glass rounded-[32px] p-8 min-h-[200px] bg-black/20 border border-white/5 text-lg leading-relaxed text-white/80 whitespace-pre-wrap break-all">
                {output || <span className="text-white/10 italic">Waiting for input...</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
