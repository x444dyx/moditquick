import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Settings, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function JpgToWebp() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(0.8);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResultBlob(null);
    setResultPreview(null);
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultBlob(blob);
          setResultPreview(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/webp', quality);
    } catch (error) {
      console.error('Conversion failed:', error);
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!resultBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(resultBlob);
    link.download = `${file?.name.split('.')[0]}.webp`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">JPG to WebP</h1>
        <p className="text-white/60">Convert JPG images to modern WebP format for better compression.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Settings size={20} />
              <span>Settings</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-white/60">Quality</label>
                  <span className="text-primary">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
            <button
              onClick={convert}
              disabled={!file || isProcessing}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isProcessing ? 'Converting...' : 'Convert to WebP'}
            </button>
          </div>

          {resultBlob && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="flex items-center gap-3 text-emerald-500 font-semibold mb-4">
                <CheckCircle2 size={20} />
                <span>Converted!</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Original:</span>
                  <span>{(file!.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">WebP:</span>
                  <span className="text-emerald-500 font-bold">{(resultBlob.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <button onClick={download} className="btn-primary w-full mt-6 bg-emerald-500 hover:bg-emerald-600">
                Download WebP
              </button>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!file ? (
            <SmartDropzone
              onFileSelect={handleFileSelect}
              accept={{ 'image/jpeg': ['.jpg', '.jpeg'] }}
              title="Select JPG image"
              description="Drop your JPG or JPEG file here"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/40 px-2">Original JPG</p>
                <div className="glass rounded-3xl overflow-hidden aspect-square relative">
                  <img src={preview!} alt="Original" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/40 px-2">WebP Preview</p>
                <div className="glass rounded-3xl overflow-hidden aspect-square relative flex items-center justify-center">
                  {resultPreview ? (
                    <img src={resultPreview} alt="Result" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center space-y-4">
                      <ImageIcon className="mx-auto text-white/10" size={48} />
                      <p className="text-sm text-white/20">Click convert to see result</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
