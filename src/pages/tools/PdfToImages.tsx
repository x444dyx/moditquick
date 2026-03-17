import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { motion } from 'framer-motion';
import { Download, FileImage, CheckCircle2, Loader2 } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';
import JSZip from 'jszip';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setImages([]);
    setProgress(0);
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setImages([]);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const imageUrls: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport } as any).promise;
        imageUrls.push(canvas.toDataURL('image/png'));
        setProgress(Math.round((i / numPages) * 100));
      }

      setImages(imageUrls);
    } catch (error) {
      console.error('PDF conversion failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = async () => {
    if (images.length === 0) return;
    const zip = new JSZip();
    images.forEach((img, index) => {
      const base64Data = img.split(',')[1];
      zip.file(`page-${index + 1}.png`, base64Data, { base64: true });
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${file?.name.split('.')[0]}-images.zip`;
    link.click();
  };

  const downloadSingle = (img: string, index: number) => {
    const link = document.createElement('a');
    link.href = img;
    link.download = `page-${index + 1}.png`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">PDF to Images</h1>
        <p className="text-white/60">Convert each page of your PDF into a high-quality PNG image.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept={{ 'application/pdf': ['.pdf'] }}
          title="Select PDF file"
          description="Drop your PDF here to extract images"
        />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 glass p-6 rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileImage size={24} />
              </div>
              <div>
                <h3 className="font-bold">{file.name}</h3>
                <p className="text-sm text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {images.length === 0 ? (
                <button
                  onClick={convert}
                  disabled={isProcessing}
                  className="btn-primary flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing {progress}%
                    </>
                  ) : (
                    'Convert to Images'
                  )}
                </button>
              ) : (
                <>
                  <button onClick={() => setFile(null)} className="glass px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
                    Start Over
                  </button>
                  <button onClick={downloadAll} className="btn-primary flex items-center gap-2">
                    <Download size={18} />
                    Download All (ZIP)
                  </button>
                </>
              )}
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-2xl overflow-hidden group relative"
                >
                  <div className="aspect-[3/4] bg-white/5 relative">
                    <img src={img} alt={`Page ${index + 1}`} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => downloadSingle(img, index)}
                        className="p-3 bg-primary rounded-full text-white transform scale-90 group-hover:scale-100 transition-transform"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 text-center text-xs font-medium text-white/40 border-t border-white/5">
                    Page {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
