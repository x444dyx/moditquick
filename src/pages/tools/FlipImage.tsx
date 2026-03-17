import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FlipHorizontal, FlipVertical, CheckCircle2, Loader2, Settings } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function FlipImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setFlipH(false);
    setFlipV(false);
    setResultUrl(null);
  };

  const applyFlip = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.src = preview!;
      await img.decode();

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.translate(flipH ? canvas.width : 0, flipV ? canvas.height : 0);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Flip failed:', error);
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `flipped-${file?.name}`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Flip Image</h1>
        <p className="text-white/60">Mirror your images horizontally or vertically in one click.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept="image/*"
          title="Select image to flip"
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
                <button 
                  onClick={() => { setFlipH(!flipH); setResultUrl(null); }} 
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${
                    flipH ? 'border-primary bg-primary/10 text-white' : 'border-white/5 glass hover:bg-white/10 text-white/60'
                  }`}
                >
                  <FlipHorizontal size={24} />
                  <span className="text-xs font-bold">Horizontal</span>
                </button>
                <button 
                  onClick={() => { setFlipV(!flipV); setResultUrl(null); }} 
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${
                    flipV ? 'border-primary bg-primary/10 text-white' : 'border-white/5 glass hover:bg-white/10 text-white/60'
                  }`}
                >
                  <FlipVertical size={24} />
                  <span className="text-xs font-bold">Vertical</span>
                </button>
              </div>

              <button
                onClick={applyFlip}
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
            <div className="glass rounded-[40px] p-8 aspect-square flex items-center justify-center bg-black/20 overflow-hidden">
              <motion.img
                animate={{ scaleX: flipH ? -1 : 1, scaleY: flipV ? -1 : 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                src={preview!}
                alt="Flip preview"
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
