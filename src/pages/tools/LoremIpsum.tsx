import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, Type, Download, RefreshCw } from 'lucide-react';

const LOREM_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ";

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [result, setResult] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const generate = () => {
    let text = '';
    if (type === 'paragraphs') {
      text = Array(count).fill(LOREM_TEXT).join('\n\n');
    } else if (type === 'sentences') {
      const sentences = LOREM_TEXT.split('. ').filter(s => s);
      text = Array(count).fill(0).map((_, i) => sentences[i % sentences.length] + '.').join(' ');
    } else {
      const words = LOREM_TEXT.split(' ');
      text = Array(count).fill(0).map((_, i) => words[i % words.length]).join(' ');
    }
    setResult(text);
  };

  useEffect(() => {
    generate();
  }, [count, type]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lorem-ipsum.txt';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Lorem Ipsum Generator</h1>
        <p className="text-white/60">Quickly generate placeholder text for your designs and prototypes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Type size={20} />
              <span>Generator Options</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/40">Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                        type === t ? 'bg-primary text-white' : 'glass hover:bg-white/10 text-white/60'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-white/40">Count</label>
                  <span className="text-primary font-bold">{count}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={type === 'words' ? 500 : 20}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <button
              onClick={generate}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Regenerate
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Generated Text</label>
            <div className="flex gap-4">
              <button onClick={copyToClipboard} className="text-xs text-primary hover:underline flex items-center gap-1">
                {isCopied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={download} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Download size={12} />
                Download .txt
              </button>
            </div>
          </div>
          <div className="w-full min-h-[400px] glass rounded-[40px] p-8 font-serif text-lg leading-relaxed text-white/80 whitespace-pre-wrap">
            {result}
          </div>
        </div>
      </div>
    </div>
  );
}
