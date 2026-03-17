import React, { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import { motion } from 'framer-motion';
import { Download, Upload, Copy, Check, Trash2, ScanText, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function OcrImageToText() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setText('');
    setError(null);
    setProgress(0);
  };

  const processOcr = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      const { data: { text: extractedText } } = await worker.recognize(file);
      await worker.terminate();

      if (!extractedText.trim()) {
        setError('No text detected in the image. Please try a clearer image.');
      } else {
        setText(extractedText);
      }
    } catch (err) {
      console.error('OCR failed:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${file?.name.split('.')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setText('');
    setError(null);
    setProgress(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">OCR Image to Text</h1>
          <p className="text-white/60">Extract readable text from images locally using Tesseract OCR.</p>
        </div>
        {file && (
          <button 
            onClick={clear}
            className="glass p-3 rounded-full text-white/40 hover:text-red-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept="image/*"
          title="Upload an image to extract text"
          description="Supports PNG, JPG, JPEG, WebP"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Image Preview & Controls */}
          <div className="space-y-6">
            <div className="glass rounded-[40px] overflow-hidden aspect-video relative border border-white/5 bg-black/20">
              <img src={preview!} alt="Original" className="w-full h-full object-contain" />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="animate-spin text-primary" size={48} />
                  <div className="text-center">
                    <p className="font-bold text-lg">Extracting Text...</p>
                    <p className="text-white/40 text-sm">{progress}% complete</p>
                  </div>
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {!text && !isProcessing && (
              <button
                onClick={processOcr}
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                <ScanText size={24} />
                Start Extraction
              </button>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </div>

          {/* Right Side: Extracted Text */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                <FileText size={14} />
                Extracted Text
              </div>
              {text && (
                <div className="flex gap-3">
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-light transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                  <button 
                    onClick={downloadTxt}
                    className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors"
                  >
                    <Download size={14} />
                    DOWNLOAD .TXT
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 glass rounded-[40px] p-8 border border-white/5 relative bg-black/20 min-h-[400px]">
              {text ? (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-full bg-transparent border-none focus:ring-0 text-white/80 resize-none font-mono text-sm leading-relaxed"
                  placeholder="Extracted text will appear here..."
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 pointer-events-none">
                  <ScanText size={64} className="mb-4" />
                  <p className="text-lg font-medium">Ready to extract</p>
                  <p className="text-sm">Click the button to start OCR</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
