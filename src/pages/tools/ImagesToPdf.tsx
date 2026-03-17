import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { motion, Reorder } from 'framer-motion';
import { Download, FileStack, CheckCircle2, Loader2, GripVertical, Trash2 } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export default function ImagesToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFilesSelect = (selectedFiles: File | File[]) => {
    const files = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
    setResultUrl(null);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setResultUrl(null);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    
    try {
      const pdf = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(img.file);
        });

        if (i > 0) pdf.addPage();
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
        const width = imgProps.width * ratio;
        const height = imgProps.height * ratio;
        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;

        pdf.addImage(imgData, 'JPEG', x, y, width, height);
      }

      const blob = pdf.output('blob');
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = 'images-combined.pdf';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Images to PDF</h1>
        <p className="text-white/60">Combine multiple images into a single, professional PDF document.</p>
      </div>

      <div className="space-y-6">
        <SmartDropzone
          onFileSelect={handleFilesSelect}
          accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
          title="Add more images"
          description="JPG, PNG, WebP supported"
        />

        {images.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-semibold text-white/60">
                {images.length} {images.length === 1 ? 'Image' : 'Images'} selected
              </h3>
              <div className="flex gap-3">
                <button onClick={() => setImages([])} className="text-sm text-red-400 hover:underline">
                  Clear All
                </button>
              </div>
            </div>

            <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-3">
              {images.map((img) => (
                <Reorder.Item
                  key={img.id}
                  value={img}
                  className="glass p-4 rounded-2xl flex items-center gap-4 group cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="text-white/20 group-hover:text-white/40 transition-colors" size={20} />
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-medium truncate">{img.file.name}</p>
                    <p className="text-xs text-white/40">{(img.file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="flex justify-center pt-4">
              {!resultUrl ? (
                <button
                  onClick={generatePdf}
                  disabled={isProcessing}
                  className="btn-primary px-12 py-4 text-lg flex items-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileStack size={20} />
                      Generate PDF
                    </>
                  )}
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <CheckCircle2 size={24} />
                    PDF Ready
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setResultUrl(null)} className="glass px-8 py-3 rounded-xl font-medium">
                      Edit Order
                    </button>
                    <button onClick={download} className="btn-primary px-8 py-3 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600">
                      <Download size={20} />
                      Download PDF
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
