import React, { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { motion, Reorder } from 'framer-motion';
import { Download, Upload, FileImage, FileStack, Trash2, GripVertical, CheckCircle2, Loader2 } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export default function ScreenshotToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFilesSelect = (selectedFiles: File | File[]) => {
    const filesArray = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    const newImages = filesArray.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
    setSuccess(false);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setSuccess(false);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setSuccess(false);

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(img.file);
        });

        // Add new page if not the first image
        if (i > 0) pdf.addPage();

        // Calculate aspect ratio to fit image on page
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.width / imgProps.height;
        let finalWidth = pageWidth;
        let finalHeight = pageWidth / ratio;

        if (finalHeight > pageHeight) {
          finalHeight = pageHeight;
          finalWidth = pageHeight * ratio;
        }

        // Center image on page
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
      }

      pdf.save(`screenshots-${new Date().getTime()}.pdf`);
      setSuccess(true);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clear = () => {
    setImages([]);
    setSuccess(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Screenshot to PDF</h1>
          <p className="text-white/60">Convert your screenshots or images into a single PDF document.</p>
        </div>
        {images.length > 0 && (
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
              <FileStack size={20} />
              <span>PDF Options</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm space-y-2">
                <p className="text-white/60">Total Images: <span className="text-white font-bold">{images.length}</span></p>
                <p className="text-white/60 text-xs">Images will be converted to A4 pages. Drag to reorder.</p>
              </div>
            </div>

            <button
              onClick={generatePdf}
              disabled={images.length === 0 || isProcessing}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={24} />
                  Generate PDF
                </>
              )}
            </button>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="flex items-center gap-3 text-emerald-500 font-semibold mb-4">
                <CheckCircle2 size={20} />
                <span>Success!</span>
              </div>
              <p className="text-sm text-white/60 mb-4">Your PDF has been generated and downloaded.</p>
              <button onClick={generatePdf} className="btn-primary w-full bg-emerald-500 hover:bg-emerald-600">
                Download Again
              </button>
            </motion.div>
          )}
        </div>

        {/* Image List / Dropzone */}
        <div className="lg:col-span-2 space-y-6">
          {images.length === 0 ? (
            <SmartDropzone
              onFileSelect={handleFilesSelect}
              accept="image/*"
              title="Upload screenshots or images"
              description="PNG, JPG, WebP supported. Select multiple files at once."
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Page Order</span>
                <button 
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="text-xs font-bold text-primary hover:text-primary-light transition-colors"
                >
                  + ADD MORE IMAGES
                </button>
                <input 
                  id="file-input"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) handleFilesSelect(Array.from(e.target.files));
                  }}
                />
              </div>

              <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-3">
                {images.map((img) => (
                  <Reorder.Item
                    key={img.id}
                    value={img}
                    className="glass p-4 rounded-2xl border border-white/5 flex items-center gap-4 group cursor-grab active:cursor-grabbing"
                  >
                    <div className="text-white/20 group-hover:text-white/40 transition-colors">
                      <GripVertical size={20} />
                    </div>
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/20 border border-white/5 flex-shrink-0">
                      <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{img.file.name}</p>
                      <p className="text-xs text-white/40">{(img.file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="p-2 rounded-full hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
