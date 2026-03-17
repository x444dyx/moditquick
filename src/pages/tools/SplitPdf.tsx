import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { motion } from 'framer-motion';
import { Upload, FileMinus, Download, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [splitRange, setSplitRange] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      const pdfBytes = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      setFile(selectedFile);
      setPageCount(pdf.getPageCount());
      setSplitRange(`1-${pdf.getPageCount()}`);
    }
  };

  const splitPdf = async () => {
    if (!file || !splitRange) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      
      // Parse range (e.g., "1-3" or "1,2,5")
      const pagesToExtract: number[] = [];
      if (splitRange.includes('-')) {
        const [start, end] = splitRange.split('-').map(n => parseInt(n.trim()));
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= pageCount) pagesToExtract.push(i - 1);
        }
      } else {
        splitRange.split(',').forEach(n => {
          const page = parseInt(n.trim());
          if (page > 0 && page <= pageCount) pagesToExtract.push(page - 1);
        });
      }

      if (pagesToExtract.length === 0) throw new Error('Invalid range');

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `split-${file.name}`;
      link.click();
    } catch (error) {
      console.error('Split failed:', error);
      alert('Failed to split PDF. Please check your page range.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Split PDF</h1>
        <p className="text-white/60">Extract specific pages from your PDF document into a new file.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Page Range</label>
                <input
                  type="text"
                  value={splitRange}
                  onChange={(e) => setSplitRange(e.target.value)}
                  placeholder="e.g. 1-5 or 1,3,5"
                  className="w-full glass rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50"
                />
                <p className="text-[10px] text-white/30">Total pages: {pageCount}</p>
              </div>
            </div>

            <button
              onClick={splitPdf}
              disabled={!file || isProcessing}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
              {isProcessing ? 'Processing...' : 'Split & Download'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!file ? (
            <label className="glass rounded-[40px] border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-20 group h-full">
              <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileMinus className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Select PDF</h3>
              <p className="text-white/40">Upload a file to start splitting</p>
            </label>
          ) : (
            <div className="glass p-8 rounded-[40px] flex flex-col items-center justify-center space-y-6 h-full">
              <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500">
                <FileText size={48} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">{file.name}</h3>
                <p className="text-white/40">{pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-sm text-white/20 hover:text-white transition-colors"
              >
                Choose different file
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
