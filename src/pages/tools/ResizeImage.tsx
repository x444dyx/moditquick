import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Settings, Maximize, CheckCircle2, RefreshCw } from 'lucide-react';

import SmartDropzone from '../../components/SmartDropzone';

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    const img = new Image();
    img.onload = () => {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(img.width / img.height);
    };
    img.src = URL.createObjectURL(selectedFile);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspectRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspectRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const resize = async () => {
    if (!file || !canvasRef.current) return;
    setIsProcessing(true);
    
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `resized-${file.name}`;
            link.click();
            setIsProcessing(false);
          }
        }, file.type);
      }
    };
    img.src = preview!;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Resize Image</h1>
        <p className="text-white/60">Change the dimensions of your images with precision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Settings size={20} />
              <span>Dimensions</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full glass rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/60">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full glass rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                  className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${maintainAspectRatio ? 'bg-primary border-primary' : 'border-white/20'}`}
                >
                  {maintainAspectRatio && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">Maintain Aspect Ratio</span>
              </label>
            </div>

            <button
              onClick={resize}
              disabled={!file || isProcessing}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
              {isProcessing ? 'Processing...' : 'Resize & Download'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!file ? (
            <SmartDropzone
              onFileSelect={handleFileSelect}
              accept="image/*"
              title="Select an image"
              description="PNG, JPG, WebP supported"
            />
          ) : (
            <div className="space-y-6">
              <div className="glass rounded-3xl overflow-hidden relative bg-white/5 flex items-center justify-center min-h-[400px]">
                <img src={preview!} alt="Preview" className="max-w-full max-h-[600px] object-contain" />
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
