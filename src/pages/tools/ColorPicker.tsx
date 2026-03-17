import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Pipette, Copy, Check, Upload, Image as ImageIcon } from 'lucide-react';

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#1E7AE6');
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
    setSelectedColor(hex.toUpperCase());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Color Picker</h1>
        <p className="text-white/60">Extract colors from images or use the visual picker.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[40px] space-y-8">
            <div className="space-y-4">
              <div 
                className="w-full h-32 rounded-3xl shadow-inner border border-white/10"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-bold">{selectedColor}</span>
                <button 
                  onClick={copyToClipboard}
                  className="p-3 glass rounded-2xl hover:bg-white/10 transition-colors text-primary"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <label className="text-sm font-medium text-white/40">Manual Selection</label>
              <input 
                type="color" 
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value.toUpperCase())}
                className="w-full h-12 bg-transparent cursor-pointer rounded-xl overflow-hidden"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!preview ? (
            <label className="glass rounded-[40px] border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-20 group h-full">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Upload image to pick colors</h3>
              <p className="text-white/40">Click anywhere on the image to extract hex codes</p>
            </label>
          ) : (
            <div className="glass rounded-[40px] overflow-hidden relative bg-white/5 p-4">
              <div className="relative cursor-crosshair">
                <img 
                  src={preview} 
                  alt="Picker" 
                  className="max-w-full rounded-2xl"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    const canvas = canvasRef.current;
                    if (canvas) {
                      canvas.width = img.naturalWidth;
                      canvas.height = img.naturalHeight;
                      canvas.getContext('2d')?.drawImage(img, 0, 0);
                    }
                  }}
                />
                <canvas 
                  ref={canvasRef} 
                  onClick={handleCanvasClick}
                  className="absolute inset-0 w-full h-full opacity-0"
                />
              </div>
              <button 
                onClick={() => setPreview(null)}
                className="mt-4 text-sm text-white/40 hover:text-white transition-colors"
              >
                Clear Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
