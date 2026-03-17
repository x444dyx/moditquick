import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, RefreshCw, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import AdBlock from "../../components/AdBlock";

export default function DocxToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile);
        setError(null);
        setIsSuccess(false);
      } else {
        setError('Please select a valid .docx file');
      }
    }
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setIsSuccess(false);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
      
      // Create a hidden container for the HTML to render it for jspdf
      const container = document.createElement('div');
      container.style.width = '800px'; // Standard width
      container.style.padding = '40px';
      container.style.backgroundColor = 'white';
      container.style.color = 'black';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.innerHTML = `
        <style>
          h1 { font-size: 24pt; margin-bottom: 12pt; }
          h2 { font-size: 18pt; margin-top: 12pt; margin-bottom: 6pt; }
          p { margin-bottom: 10pt; line-height: 1.5; }
          table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
          table, th, td { border: 1px solid black; padding: 8px; }
          img { max-width: 100%; height: auto; }
        </style>
        ${html}
      `;
      document.body.appendChild(container);

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling']
      });

      await pdf.html(container, {
        callback: function (doc) {
          doc.save(`${file.name.replace('.docx', '')}.pdf`);
          document.body.removeChild(container);
          setIsSuccess(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1E7AE6', '#3EA1FF', '#FFFFFF']
          });
          setIsProcessing(false);
        },
        x: 0,
        y: 0,
        width: 445, // a4 width in px at 72 dpi is ~595, but we need to account for margins
        windowWidth: 800
      });

    } catch (err: any) {
      console.error('Conversion failed:', err);
      setError(err.message || 'Failed to convert document. Make sure it is a valid DOCX file.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">DOCX to PDF</h1>
        <p className="text-white/60">Convert Word documents to PDF format with layout preservation.</p>
      </div>

      <div className="space-y-8">
        {!file ? (
          <label className="glass rounded-[40px] border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-24 group">
            <input type="file" className="hidden" accept=".docx" onChange={handleFileChange} />
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="text-primary" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Drop your DOCX here</h3>
            <p className="text-white/40">or click to browse files</p>
          </label>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[40px] space-y-8"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText size={48} />
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold">{file.name}</h3>
                <p className="text-white/40">{(file.size / 1024).toFixed(1)} KB</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {isSuccess && (
                <div className="flex items-center gap-2 text-emerald-500 text-sm bg-emerald-500/10 px-4 py-2 rounded-xl">
                  <CheckCircle2 size={16} />
                  Successfully converted and downloaded!
                </div>
              )}

              <div className="flex gap-4 w-full max-w-sm">
                <button
                  onClick={convert}
                  disabled={isProcessing}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                  {isProcessing ? 'Converting...' : 'Convert to PDF'}
                </button>
                
                <button 
                  onClick={() => { setFile(null); setIsSuccess(false); setError(null); }}
                  className="glass px-6 py-3 rounded-full text-sm text-white/40 hover:text-white transition-colors"
                >
                  Change File
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Ad Block */}
      {file && (
        <AdBlock />
      )}

      <div className="glass p-8 rounded-[32px] bg-primary/5 border-primary/10">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Zap size={18} className="text-primary" />
          Why use our converter?
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/50">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>100% Private: Your document never leaves your browser.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Fast: Instant conversion using local processing.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>No Limits: Convert as many files as you want for free.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>High Quality: Preserves text formatting and structure.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
