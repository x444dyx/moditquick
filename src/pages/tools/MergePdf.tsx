import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { motion, Reorder } from 'framer-motion';
import { Upload, FilePlus, Download, X, FileText, GripVertical } from 'lucide-react';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function MergePdf() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles
      .filter((f: File) => f.type === 'application/pdf')
      .map((f: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        name: f.name,
        size: f.size
      }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const pdfFile of files) {
        const pdfBytes = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'merged-document.pdf';
      link.click();
    } catch (error) {
      console.error('Merge failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Merge PDF</h1>
        <p className="text-white/60">Combine multiple PDF documents into a single file. Drag to reorder.</p>
      </div>

      <div className="space-y-6">
        <label className="glass rounded-3xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-12 group">
          <input type="file" className="hidden" accept="application/pdf" multiple onChange={handleFileChange} />
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FilePlus className="text-primary" size={28} />
          </div>
          <h3 className="text-xl font-bold">Add PDF Files</h3>
          <p className="text-white/40 text-sm">Select files from your computer</p>
        </label>

        {files.length > 0 && (
          <div className="space-y-4">
            <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-3">
              {files.map((file) => (
                <Reorder.Item
                  key={file.id}
                  value={file}
                  className="glass p-4 rounded-2xl flex items-center gap-4 group cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="text-white/20 group-hover:text-white/40 transition-colors" size={20} />
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <X size={18} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="pt-6 flex justify-center">
              <button
                onClick={mergePdfs}
                disabled={files.length < 2 || isProcessing}
                className="btn-primary flex items-center gap-2 px-12 disabled:opacity-50"
              >
                {isProcessing ? 'Merging...' : (
                  <>
                    <Download size={18} />
                    Merge {files.length} Files
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
