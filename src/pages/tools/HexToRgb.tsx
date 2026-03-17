import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, Palette, Hash } from 'lucide-react';

export default function HexToRgb() {
  const [hex, setHex] = useState('#6366F1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h.split('').map(c => c + c).join('');
    }
    
    if (h.length === 6) {
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        setRgb(`rgb(${r}, ${g}, ${b})`);
      }
    }
  }, [hex]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rgb);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">HEX to RGB</h1>
        <p className="text-white/60">Convert hexadecimal color codes to RGB values instantly.</p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        <div className="glass p-8 rounded-[40px] space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Hash size={14} />
              HEX Color
            </label>
            <div className="relative">
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#000000"
                className="w-full glass rounded-2xl px-6 py-4 text-xl font-mono focus:outline-none focus:border-primary/50"
              />
              <div 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg shadow-inner border border-white/10"
                style={{ backgroundColor: hex }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Palette size={14} />
              RGB Result
            </label>
            <div className="relative group">
              <div className="w-full glass rounded-2xl px-6 py-4 text-xl font-mono text-primary">
                {rgb}
              </div>
              <button
                onClick={copyToClipboard}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-lg hover:bg-white/10 transition-colors"
              >
                {isCopied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {['#F43F5E', '#10B981', '#3B82F6', '#F59E0B'].map((color) => (
            <button
              key={color}
              onClick={() => setHex(color)}
              className="aspect-square rounded-2xl shadow-xl border border-white/10 transition-transform hover:scale-110 active:scale-95"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
