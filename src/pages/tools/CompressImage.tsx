import React, { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { motion } from 'framer-motion';
import { Download, Upload, Settings, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

import SmartDropzone from '../../components/SmartDropzone';

export default function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setCompressedFile(null);
    setCompressedPreview(null);
  };

  const compress = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality,
      };
      const compressed = await imageCompression(file, options);
      setCompressedFile(compressed);
      setCompressedPreview(URL.createObjectURL(compressed));
    } catch (error) {
      console.error('Compression failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!compressedFile) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedFile);
    link.download = `compressed-${file?.name}`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Compress Image</h1>
        <p className="text-white/60">Reduce file size without losing quality. Perfect for web optimization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
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

              <div className="space-y-2">
                <label className="text-sm text-white/60">Max Width (px)</label>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                  className="w-full glass rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <button
              onClick={compress}
              disabled={!file || isProcessing}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Compress Image'}
            </button>
          </div>

          {compressedFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="flex items-center gap-3 text-emerald-500 font-semibold mb-4">
                <CheckCircle2 size={20} />
                <span>Success!</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Original:</span>
                  <span>{(file!.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Compressed:</span>
                  <span className="text-emerald-500 font-bold">{(compressedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                  <span className="text-white/40">Savings:</span>
                  <span className="text-emerald-500">{Math.round((1 - compressedFile.size / file!.size) * 100)}%</span>
                </div>
              </div>
              <button onClick={download} className="btn-primary w-full mt-6 bg-emerald-500 hover:bg-emerald-600">
                Download Result
              </button>
            </motion.div>
          )}
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2 space-y-6">
          {!file ? (
            <SmartDropzone
              onFileSelect={handleFileSelect}
              accept="image/*"
              title="Select an image"
              description="PNG, JPG, WebP supported"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/40 px-2">Original</p>
                <div className="glass rounded-3xl overflow-hidden aspect-square relative">
                  <img src={preview!} alt="Original" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/40 px-2">Compressed Preview</p>
                <div className="glass rounded-3xl overflow-hidden aspect-square relative flex items-center justify-center">
                  {compressedPreview ? (
                    <img src={compressedPreview} alt="Compressed" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center space-y-4">
                      <ImageIcon className="mx-auto text-white/10" size={48} />
                      <p className="text-sm text-white/20">Click compress to see result</p>
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
