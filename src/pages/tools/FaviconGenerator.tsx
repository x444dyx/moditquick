import { useState, useRef } from 'react';
import { Download, Globe, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
import SmartDropzone from '../../components/SmartDropzone';

const FAVICON_SIZES = [16, 32, 48, 64, 128, 256];

export default function FaviconGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateFaviconBlob = (size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!image || !canvasRef.current) {
        reject(new Error('No image or canvas available'));
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Blob generation failed'));
        }, 'image/png');
      };
      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = image;
    });
  };

  const downloadFavicon = async (size: number) => {
    try {
      const blob = await generateFaviconBlob(size);
      const link = document.createElement('a');
      link.download = `favicon-${size}x${size}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error generating favicon:', error);
    }
  };

  const downloadAll = async () => {
    if (!image) return;
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      
      for (const size of FAVICON_SIZES) {
        const blob = await generateFaviconBlob(size);
        zip.file(`favicon-${size}x${size}.png`, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = 'favicons.zip';
      link.href = URL.createObjectURL(content);
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating ZIP:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Globe size={24} />
          </div>
          <h1 id="favicon-generator-title" className="text-3xl font-bold">Favicon Generator</h1>
        </div>
        <p className="text-white/60">
          Convert any image into a professional favicon for your website.
        </p>
      </div>

      {!image ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept="image/*"
          title="Upload your logo or icon"
          description="PNG, JPG or SVG recommended. Square images work best."
        />
      ) : (
        <div className="space-y-8">
          <div className="glass rounded-3xl p-8 border border-white/5">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <button 
                    onClick={() => setImage(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    Change Image
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {FAVICON_SIZES.map((size) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-20 h-20 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden p-2"
                      >
                        <img 
                          src={image} 
                          alt={`Favicon ${size}`}
                          style={{ 
                            width: Math.min(size, 64), 
                            height: Math.min(size, 64) 
                          }}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">{size}x{size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-64 space-y-4">
                <button
                  onClick={downloadAll}
                  disabled={isProcessing}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Download size={20} />
                  )}
                  Download All Sizes
                </button>
                <p className="text-[11px] text-white/40 text-center">
                  Generates PNG files for all standard web sizes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FAVICON_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => downloadFavicon(size)}
                className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-primary transition-colors">
                    <ImageIcon size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{size}x{size}</div>
                    <div className="text-xs text-white/40">PNG Icon</div>
                  </div>
                </div>
                <Download size={18} className="text-white/20 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
