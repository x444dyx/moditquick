import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCw, RotateCcw, CheckCircle2, Loader2, Settings, Image as ImageIcon } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function RotateImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setRotation(0);
    setResultUrl(null);
  };

  const rotate = (angle: number) => {
    setRotation(prev => (prev + angle + 360) % 360);
    setResultUrl(null);
  };

  const applyRotation = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.src = preview!;
      await img.decode();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Calculate new canvas size
      if (rotation % 180 === 90) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Rotation failed:', error);
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `rotated-${file?.name}`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Rotate Image</h1>
        <p className="text-white/60">Rotate your images to any 90° angle instantly.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept="image/*"
          title="Select image to rotate"
          description="JPG, PNG, WebP supported"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Settings size={20} />
                <span>Controls</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => rotate(-90)} className="glass p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                  <RotateCcw size={24} />
                  <span className="text-xs font-bold">-90°</span>
                </button>
                <button onClick={() => rotate(90)} className="glass p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                  <RotateCw size={24} />
                  <span className="text-xs font-bold">+90°</span>
                </button>
              </div>

              <div className="p-4 glass rounded-2xl text-center">
                <span className="text-sm text-white/40 block mb-1">Current Rotation</span>
                <span className="text-2xl font-bold text-primary">{rotation}°</span>
              </div>

              <button
                onClick={applyRotation}
                disabled={isProcessing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                Apply & Save
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
                  <span>Ready to Download</span>
                </div>
                <button onClick={download} className="btn-primary w-full bg-emerald-500 hover:bg-emerald-600">
                  Download Image
                </button>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="glass rounded-[40px] p-8 aspect-square flex items-center justify-center bg-black/20 overflow-hidden relative">
              <motion.img
                animate={{ rotate: rotation }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                src={preview!}
                alt="Rotate preview"
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
