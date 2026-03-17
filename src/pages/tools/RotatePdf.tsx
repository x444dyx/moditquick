import React, { useState, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { motion } from 'framer-motion';
import { Download, RotateCw, RotateCcw, CheckCircle2, Loader2, FileText } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PageState {
  index: number;
  rotation: number;
  preview: string;
}

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageState[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setPages([]);
    setResultUrl(null);
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const newPages: PageState[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport } as any).promise;
        newPages.push({
          index: i - 1,
          rotation: 0,
          preview: canvas.toDataURL()
        });
      }
      setPages(newPages);
    } catch (error) {
      console.error('Failed to load PDF pages:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const rotatePage = (index: number, angle: number) => {
    setPages(prev => prev.map(p => 
      p.index === index ? { ...p, rotation: (p.rotation + angle + 360) % 360 } : p
    ));
    setResultUrl(null);
  };

  const rotateAll = (angle: number) => {
    setPages(prev => prev.map(p => ({ ...p, rotation: (p.rotation + angle + 360) % 360 })));
    setResultUrl(null);
  };

  const generatePdf = async () => {
    if (!file) return;
    setIsGenerating(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfPages = pdfDoc.getPages();

      pages.forEach((p, i) => {
        if (p.rotation !== 0) {
          const page = pdfPages[i];
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + p.rotation));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Failed to generate rotated PDF:', error);
    } finally {
      setIsGenerating(false);
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
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Rotate PDF</h1>
        <p className="text-white/60">Rotate individual pages or the entire document with ease.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept={{ 'application/pdf': ['.pdf'] }}
          title="Select PDF file"
          description="Drop your PDF here to rotate pages"
        />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 glass p-6 rounded-3xl sticky top-24 z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold">{file.name}</h3>
                <p className="text-sm text-white/40">{pages.length} Pages</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => rotateAll(-90)} className="glass p-2.5 rounded-xl hover:bg-white/5" title="Rotate All Left">
                <RotateCcw size={20} />
              </button>
              <button onClick={() => rotateAll(90)} className="glass p-2.5 rounded-xl hover:bg-white/5" title="Rotate All Right">
                <RotateCw size={20} />
              </button>
              <div className="w-px h-8 bg-white/10 mx-2" />
              {!resultUrl ? (
                <button
                  onClick={generatePdf}
                  disabled={isGenerating || isProcessing}
                  className="btn-primary flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  Save PDF
                </button>
              ) : (
                <button onClick={download} className="btn-primary flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600">
                  <Download size={18} />
                  Download
                </button>
              )}
            </div>
          </div>

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 size={48} className="text-primary animate-spin" />
              <p className="text-white/40">Loading PDF pages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {pages.map((p) => (
                <motion.div
                  key={p.index}
                  layout
                  className="glass rounded-2xl overflow-hidden group relative"
                >
                  <div className="aspect-[3/4] bg-white/5 p-4 flex items-center justify-center">
                    <motion.img
                      animate={{ rotate: p.rotation }}
                      src={p.preview}
                      alt={`Page ${p.index + 1}`}
                      className="max-w-full max-h-full object-contain shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => rotatePage(p.index, -90)}
                        className="p-2 bg-white/10 hover:bg-primary rounded-lg transition-colors"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() => rotatePage(p.index, 90)}
                        className="p-2 bg-white/10 hover:bg-primary rounded-lg transition-colors"
                      >
                        <RotateCw size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-2 text-center text-[10px] font-bold text-white/20 uppercase tracking-widest border-t border-white/5">
                    Page {p.index + 1}
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
