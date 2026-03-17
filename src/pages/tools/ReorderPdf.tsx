import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { motion, Reorder } from 'framer-motion';
import { Download, ArrowUpDown, CheckCircle2, Loader2, FileText, GripVertical } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PageItem {
  id: string;
  originalIndex: number;
  preview: string;
}

export default function ReorderPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
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
      const newPages: PageItem[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport } as any).promise;
        newPages.push({
          id: `page-${i}`,
          originalIndex: i - 1,
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

  const generatePdf = async () => {
    if (!file) return;
    setIsGenerating(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();
      
      const indices = pages.map(p => p.originalIndex);
      const copiedPages = await newDoc.copyPages(originalDoc, indices);
      
      copiedPages.forEach(page => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Failed to reorder PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `reordered-${file?.name}`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Reorder PDF Pages</h1>
        <p className="text-white/60">Drag and drop pages to rearrange your PDF document exactly how you want.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept={{ 'application/pdf': ['.pdf'] }}
          title="Select PDF file"
          description="Drop your PDF here to rearrange pages"
        />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 glass p-6 rounded-3xl sticky top-24 z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ArrowUpDown size={24} />
              </div>
              <div>
                <h3 className="font-bold">{file.name}</h3>
                <p className="text-sm text-white/40">{pages.length} Pages</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setFile(null)} className="glass px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5">
                Cancel
              </button>
              {!resultUrl ? (
                <button
                  onClick={generatePdf}
                  disabled={isGenerating || isProcessing}
                  className="btn-primary flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  Save New Order
                </button>
              ) : (
                <button onClick={download} className="btn-primary flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600">
                  <Download size={18} />
                  Download PDF
                </button>
              )}
            </div>
          </div>

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 size={48} className="text-primary animate-spin" />
              <p className="text-white/40">Preparing pages for reordering...</p>
            </div>
          ) : (
            <Reorder.Group axis="y" values={pages} onReorder={setPages} className="space-y-4">
              {pages.map((p, index) => (
                <Reorder.Item
                  key={p.id}
                  value={p}
                  className="glass p-4 rounded-2xl flex items-center gap-6 group cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="text-white/20 group-hover:text-white/40 transition-colors" size={20} />
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/40">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="w-24 h-32 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 shadow-xl">
                    <img src={p.preview} alt={`Page ${p.originalIndex + 1}`} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-grow">
                    <p className="font-medium">Page {p.originalIndex + 1}</p>
                    <p className="text-xs text-white/20 uppercase tracking-widest mt-1">Original Position</p>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>
      )}
    </div>
  );
}
