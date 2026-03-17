import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, Palette, Hash } from 'lucide-react';

export default function RgbToHex() {
  const [r, setR] = useState(99);
  const [g, setG] = useState(102);
  const [b, setB] = useState(241);
  const [hex, setHex] = useState('#6366F1');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const toHex = (n: number) => {
      const h = Math.max(0, Math.min(255, n)).toString(16);
      return h.length === 1 ? '0' + h : h;
    };
    setHex(`#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase());
  }, [r, g, b]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hex);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">RGB to HEX</h1>
        <p className="text-white/60">Convert RGB color values to hexadecimal color codes instantly.</p>
      </div>

      <div className="max-w-md mx-auto space-y-8">
        <div className="glass p-8 rounded-[40px] space-y-8">
          <div className="space-y-6">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Palette size={14} />
              RGB Values
            </label>
            
            <div className="space-y-4">
              {[
                { label: 'Red', value: r, setter: setR, color: 'accent-red-500' },
                { label: 'Green', value: g, setter: setG, color: 'accent-emerald-500' },
                { label: 'Blue', value: b, setter: setB, color: 'accent-blue-500' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">{item.label}</span>
                    <span className="font-mono">{item.value}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={item.value}
                    onChange={(e) => item.setter(parseInt(e.target.value))}
                    className={`w-full ${item.color}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Hash size={14} />
              HEX Result
            </label>
            <div className="relative group">
              <div className="w-full glass rounded-2xl px-6 py-4 text-xl font-mono text-primary flex items-center gap-4">
                <div 
                  className="w-8 h-8 rounded-lg shadow-inner border border-white/10"
                  style={{ backgroundColor: hex }}
                />
                {hex}
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
      </div>
    </div>
  );
}
