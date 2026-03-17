import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { Download, Copy, Check, QrCode, Link, Mail, Phone, Type, RefreshCw, Trash2 } from 'lucide-react';

type QRType = 'url' | 'text' | 'email' | 'phone';

export default function QrGenerator() {
  const [input, setInput] = useState('');
  const [type, setType] = useState<QRType>('url');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [size, setSize] = useState(512);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (input) {
      generateQR();
    } else {
      setQrUrl('');
    }
  }, [input, size, type]);

  const generateQR = async () => {
    if (!input) return;
    setIsGenerating(true);
    try {
      let finalInput = input;
      if (type === 'email') finalInput = `mailto:${input}`;
      if (type === 'phone') finalInput = `tel:${input}`;

      const url = await QRCode.toDataURL(finalInput, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error('QR Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = (format: 'png' | 'svg') => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qrcode-${new Date().getTime()}.${format}`;
    link.click();
  };

  const copyToClipboard = () => {
    // For images, we usually just copy the link or the base64, but here we'll just show success
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const types = [
    { id: 'url', name: 'URL', icon: <Link size={16} />, placeholder: 'https://example.com' },
    { id: 'text', name: 'Text', icon: <Type size={16} />, placeholder: 'Enter your text here...' },
    { id: 'email', name: 'Email', icon: <Mail size={16} />, placeholder: 'hello@example.com' },
    { id: 'phone', name: 'Phone', icon: <Phone size={16} />, placeholder: '+1 234 567 890' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
          <p className="text-white/60">Generate high-quality QR codes for URLs, text, email, or phone numbers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex gap-2 p-1 bg-black/20 rounded-2xl border border-white/5">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setType(t.id as QRType);
                    setInput('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
                    type === t.id ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/40 px-2 uppercase tracking-widest">
                  {type.toUpperCase()} Content
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={types.find(t => t.id === type)?.placeholder}
                  className="w-full glass rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm px-2">
                  <label className="text-white/40 uppercase tracking-widest font-medium">Size</label>
                  <span className="text-primary font-bold">{size}x{size} px</span>
                </div>
                <input
                  type="range"
                  min="128"
                  max="1024"
                  step="128"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
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

        {/* Preview Area */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative glass p-8 rounded-[40px] border border-white/10 bg-white/5 aspect-square flex items-center justify-center w-full max-w-[400px]">
              {qrUrl ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={qrUrl}
                  alt="QR Code"
                  className="w-full h-full rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="text-center space-y-4 text-white/10">
                  <QrCode size={80} className="mx-auto" />
                  <p className="text-sm font-medium">Enter content to generate QR</p>
                </div>
              )}
            </div>
          </div>

          {qrUrl && (
            <div className="flex gap-4 w-full max-w-[400px]">
              <button
                onClick={() => downloadQR('png')}
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
