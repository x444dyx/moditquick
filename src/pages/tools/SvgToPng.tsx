import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileCode, CheckCircle2, Loader2, Settings } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function SvgToPng() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResultUrl(null);
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(text, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');
      
      if (!svgElement) throw new Error('Invalid SVG');

      const width = parseInt(svgElement.getAttribute('width') || '300');
      const height = parseInt(svgElement.getAttribute('height') || '300');

      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const img = new Image();
      const svgBlob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            setResultUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
      img.src = url;
    } catch (error) {
      console.error('SVG conversion failed:', error);
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${file?.name.split('.')[0]}.png`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">SVG to PNG</h1>
        <p className="text-white/60">Convert vector SVG files into high-resolution PNG images.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept={{ 'image/svg+xml': ['.svg'] }}
          title="Select SVG file"
          description="Drop your .svg file here"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Settings size={20} />
                <span>Export Settings</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <label className="text-white/60">Resolution Scale</label>
                    <span className="text-primary">{scale}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={scale}
                    onChange={(e) => setScale(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <p className="text-[10px] text-white/30">Higher scale means sharper PNG output.</p>
                </div>
              </div>

              <button
                onClick={convert}
                disabled={isProcessing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                Convert to PNG
              </button>
            </div>

            {resultUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold mb-4">
                  <CheckCircle2 size={20} />
                  <span>PNG Ready</span>
                </div>
                <button onClick={download} className="btn-primary w-full bg-emerald-500 hover:bg-emerald-600">
                  Download PNG
                </button>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="glass rounded-[40px] p-8 aspect-square flex items-center justify-center bg-white/5 overflow-hidden relative">
              <img src={preview!} alt="SVG preview" className="max-w-full max-h-full object-contain" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                Vector Preview
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
