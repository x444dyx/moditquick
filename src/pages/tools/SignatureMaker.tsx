import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash2, Settings, Image as ImageIcon, CheckCircle2, Sliders } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function SignatureMaker() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  useEffect(() => {
    if (preview) {
      processImage();
    }
  }, [preview, threshold]);

  const processImage = () => {
    if (!preview) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate brightness
        const brightness = (r + g + b) / 3;

        // If brightness is above threshold, make it transparent
        if (brightness > threshold) {
          data[i + 3] = 0; // Alpha
        } else {
          // Optionally make the signature pure black for better contrast
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `signature-${new Date().getTime()}.png`;
    link.click();
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Signature PNG Maker</h1>
          <p className="text-white/60">Remove white backgrounds from your signatures and make them transparent locally.</p>
        </div>
        {file && (
          <button 
            onClick={clear}
            className="glass p-3 rounded-full text-white/40 hover:text-red-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Sliders size={20} />
              <span>Threshold Settings</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm px-2">
                  <label className="text-white/60">Sensitivity</label>
                  <span className="text-primary font-bold">{threshold}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="250"
                  step="1"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="text-[10px] text-white/20 px-2">Adjust to remove more or less background</p>
              </div>
            </div>

            <button
              onClick={download}
              disabled={!result}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download size={20} />
              Download PNG
            </button>
          </div>

          <div className="glass p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5 flex items-start gap-4">
            <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={20} />
            <div className="space-y-1">
              <p className="text-sm font-bold text-emerald-500">Transparent Output</p>
              <p className="text-xs text-white/40 leading-relaxed">
                The result is a high-contrast transparent PNG, perfect for digital documents.
              </p>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 space-y-6">
          {!file ? (
            <SmartDropzone
              onFileSelect={handleFileSelect}
              accept="image/*"
              title="Upload signature image"
              description="PNG, JPG, WebP supported. High contrast works best."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/40 px-2 uppercase tracking-widest">Original</p>
                <div className="glass rounded-3xl overflow-hidden aspect-square relative border border-white/5 bg-black/20">
                  <img src={preview!} alt="Original" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/40 px-2 uppercase tracking-widest">Transparent Result</p>
                <div className="glass rounded-3xl overflow-hidden aspect-square relative border border-white/5 bg-black/20 checkerboard">
                  {result ? (
                    <img src={result} alt="Result" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/10">
                      <ImageIcon size={48} className="mb-2" />
                      <p className="text-xs">Processing...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      <style dangerouslySetInnerHTML={{ __html: `
        .checkerboard {
          background-image: linear-gradient(45deg, #111 25%, transparent 25%), 
                            linear-gradient(-45deg, #111 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #111 75%), 
                            linear-gradient(-45deg, transparent 75%, #111 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}} />
    </div>
  );
}
