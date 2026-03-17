import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Download, Trash2, Copy, Check } from 'lucide-react';

export default function Base64ToImage() {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!input.trim()) return;
    // Basic validation for base64
    if (input.startsWith('data:image/')) {
      setPreview(input);
    } else {
      // Try to wrap it if it's just the raw base64
      setPreview(`data:image/png;base64,${input}`);
    }
  };

  const download = () => {
    if (!preview) return;
    const link = document.createElement('a');
    link.href = preview;
    link.download = 'decoded-image.png';
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Base64 to Image</h1>
        <p className="text-white/60">Decode base64 strings back into viewable and downloadable images.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-medium text-white/40">Base64 String</label>
            <button 
              onClick={() => setInput('')}
              className="text-white/20 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="glass rounded-3xl overflow-hidden h-80">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your base64 string here..."
              className="w-full h-full bg-transparent p-6 font-mono text-xs focus:outline-none resize-none"
            />
          </div>
          <button onClick={handleConvert} className="btn-primary w-full">Decode Image</button>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-white/40 px-2">Preview</label>
          <div className="glass rounded-3xl overflow-hidden h-80 flex items-center justify-center bg-white/5">
            {preview ? (
              <img src={preview} alt="Decoded" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-center space-y-4">
                <ImageIcon className="mx-auto text-white/10" size={48} />
                <p className="text-sm text-white/20">Decoded image will appear here</p>
              </div>
            )}
          </div>
          {preview && (
            <button onClick={download} className="btn-primary w-full bg-emerald-500 hover:bg-emerald-600">
              Download Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
