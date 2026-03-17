import React, { useState, useEffect, useRef } from 'react';
import * as bwipjs from 'bwip-js';
import { motion } from 'framer-motion';
import { Download, Copy, Check, Barcode, Settings, Trash2, AlertCircle, RefreshCw } from 'lucide-react';

type BarcodeFormat = 'code128' | 'code39' | 'ean13' | 'ean8' | 'upca' | 'itf14';

export default function BarcodeGenerator() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState<BarcodeFormat>('code128');
  const [barcodeUrl, setBarcodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (input) {
      generateBarcode();
    } else {
      setBarcodeUrl('');
      setError(null);
    }
  }, [input, format]);

  const generateBarcode = () => {
    if (!input) return;
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      bwipjs.toCanvas(canvas, {
        bcid: format,
        text: input,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });
      setBarcodeUrl(canvas.toDataURL('image/png'));
    } catch (err: any) {
      console.error('Barcode Generation failed:', err);
      setError(err.message || 'Invalid input for selected format');
      setBarcodeUrl('');
    }
  };

  const downloadBarcode = () => {
    if (!barcodeUrl) return;
    const link = document.createElement('a');
    link.href = barcodeUrl;
    link.download = `barcode-${format}-${new Date().getTime()}.png`;
    link.click();
  };

  const copyToClipboard = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formats = [
    { id: 'code128', name: 'Code 128', description: 'Standard alphanumeric' },
    { id: 'code39', name: 'Code 39', description: 'Legacy alphanumeric' },
    { id: 'ean13', name: 'EAN-13', description: 'Standard retail (13 digits)' },
    { id: 'ean8', name: 'EAN-8', description: 'Small retail (8 digits)' },
    { id: 'upca', name: 'UPC-A', description: 'US retail (12 digits)' },
    { id: 'itf14', name: 'ITF-14', description: 'Shipping containers' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Barcode Generator</h1>
          <p className="text-white/60">Generate high-quality barcodes in various industry-standard formats locally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Settings size={20} />
              <span>Barcode Settings</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/40 px-2 uppercase tracking-widest">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {formats.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id as BarcodeFormat)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        format === f.id 
                          ? 'bg-primary/10 border-primary text-white' 
                          : 'bg-black/20 border-white/5 text-white/40 hover:border-white/10'
                      }`}
                    >
                      <p className="text-sm font-bold">{f.name}</p>
                      <p className="text-[10px] opacity-60 uppercase tracking-tighter">{f.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/40 px-2 uppercase tracking-widest">Content</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter barcode content..."
                  className="w-full glass rounded-2xl p-4 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={() => setInput('')}
              className="w-full py-3 rounded-2xl border border-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Clear Input
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative group w-full max-w-[400px]">
            <div className="absolute -inset-4 bg-primary/20 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative glass p-8 rounded-[40px] border border-white/10 bg-white/5 aspect-square flex items-center justify-center w-full">
              {barcodeUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 rounded-2xl shadow-2xl w-full flex items-center justify-center"
                >
                  <img
                    src={barcodeUrl}
                    alt="Barcode"
                    className="max-w-full h-auto"
                  />
                </motion.div>
              ) : (
                <div className="text-center space-y-4 text-white/10">
                  <Barcode size={80} className="mx-auto" />
                  <p className="text-sm font-medium">Enter content to generate barcode</p>
                </div>
              )}
            </div>
          </div>

          {barcodeUrl && (
            <div className="flex gap-4 w-full max-w-[400px]">
              <button
                onClick={downloadBarcode}
                className="flex-1 btn-primary py-4 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download PNG
              </button>
              <button
                onClick={copyToClipboard}
                className="glass px-6 py-4 rounded-2xl text-white/60 hover:text-white transition-colors flex items-center gap-2"
              >
                {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
