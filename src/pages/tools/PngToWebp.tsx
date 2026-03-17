import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Upload, RefreshCw, Zap } from 'lucide-react';

export default function PngToWebp() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(0.85);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${file.name.split('.')[0]}.webp`;
            link.click();
            setIsProcessing(false);
          }
        }, 'image/webp', quality);
      }
    };
    img.src = preview!;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">PNG to WebP</h1>
        <p className="text-white/60">Convert PNG images to modern WebP format for better web performance.</p>
      </div>

      <div className="space-y-8">
        {!file ? (
          <label className="glass rounded-[40px] border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-24 group">
            <input type="file" className="hidden" accept="image/png" onChange={handleFileChange} />
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="text-primary" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Drop your PNG here</h3>
            <p className="text-white/40">or click to browse files</p>
          </label>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[40px] space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 aspect-square glass rounded-3xl overflow-hidden relative">
                <img src={preview!} alt="Preview" className="w-full h-full object-contain" />
              </div>
              
              <div className="w-full md:w-1/2 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <label className="text-white/60">WebP Quality</label>
                    <span className="text-primary font-bold">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Filename:</span>
                    <span className="truncate max-w-[150px]">{file.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Size:</span>
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <button
                  onClick={convert}
                  disabled={isProcessing}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                  {isProcessing ? 'Converting...' : 'Convert & Download WebP'}
                </button>
                
                <button 
                  onClick={() => setFile(null)}
                  className="w-full text-sm text-white/20 hover:text-white transition-colors"
                >
                  Choose different file
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
