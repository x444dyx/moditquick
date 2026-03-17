import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, CheckCircle2, Loader2, Settings, Instagram, Twitter, Linkedin, Youtube, Facebook } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

const PRESETS = [
  { id: 'ig-square', name: 'Instagram Square', width: 1080, height: 1080, icon: Instagram },
  { id: 'ig-story', name: 'Instagram Story', width: 1080, height: 1920, icon: Instagram },
  { id: 'tw-post', name: 'Twitter Post', width: 1200, height: 675, icon: Twitter },
  { id: 'li-post', name: 'LinkedIn Post', width: 1200, height: 627, icon: Linkedin },
  { id: 'yt-thumb', name: 'YouTube Thumbnail', width: 1280, height: 720, icon: Youtube },
  { id: 'fb-post', name: 'Facebook Post', width: 1200, height: 630, icon: Facebook },
];

export default function SocialResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResultUrl(null);
  };

  const resize = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.src = preview!;
      await img.decode();

      const canvas = document.createElement('canvas');
      canvas.width = selectedPreset.width;
      canvas.height = selectedPreset.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Fill background (e.g., white or black)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image centered and covering/fitting
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Resize failed:', error);
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${selectedPreset.id}-${file?.name}`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Social Media Resizer</h1>
        <p className="text-white/60">Instantly resize your images for all major social platforms.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept="image/*"
          title="Select image to resize"
          description="JPG, PNG, WebP supported"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Settings size={20} />
                <span>Select Preset</span>
              </div>
              
              <div className="space-y-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => { setSelectedPreset(preset); setResultUrl(null); }}
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border-2 text-left ${
                      selectedPreset.id === preset.id 
                        ? 'border-primary bg-primary/10 text-white' 
                        : 'border-white/5 glass hover:bg-white/10 text-white/60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedPreset.id === preset.id ? 'bg-primary text-white' : 'bg-white/5'}`}>
                      <preset.icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{preset.name}</div>
                      <div className="text-[10px] opacity-60">{preset.width} × {preset.height}</div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={resize}
                disabled={isProcessing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
                Generate Resize
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
                  <span>Resize Ready</span>
                </div>
                <button onClick={download} className="btn-primary w-full bg-emerald-500 hover:bg-emerald-600">
                  Download Image
                </button>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="glass rounded-[40px] p-8 flex items-center justify-center bg-black/20 overflow-hidden relative min-h-[500px]">
              <div 
                className="relative shadow-2xl overflow-hidden bg-black"
                style={{ 
                  aspectRatio: `${selectedPreset.width} / ${selectedPreset.height}`,
                  maxHeight: '70vh',
                  maxWidth: '100%'
                }}
              >
                {resultUrl ? (
                  <img src={resultUrl} alt="Resized" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full relative">
                    <img src={preview!} alt="Original" className="w-full h-full object-cover opacity-40 blur-sm" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <selectedPreset.icon size={48} className="text-primary mb-4" />
                      <p className="font-bold text-xl">{selectedPreset.name}</p>
                      <p className="text-white/40 text-sm mt-2">Click generate to see the final crop/resize</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
