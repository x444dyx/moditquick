import React, { useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { motion } from 'framer-motion';
import { Scan, Upload, Copy, Check, Trash2, QrCode, ExternalLink, AlertCircle, Image as ImageIcon } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function QrScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
    scanQR(selectedFile);
  };

  const scanQR = async (imageFile: File) => {
    setIsScanning(true);
    setError(null);

    try {
      const image = new Image();
      image.src = URL.createObjectURL(imageFile);
      
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not get canvas context');

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setResult(code.data);
      } else {
        setError('No QR code detected in the image. Please try another image.');
      }
    } catch (err) {
      console.error('QR Scanning failed:', err);
      setError('Failed to scan image. Make sure it is a valid image file.');
    } finally {
      setIsScanning(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">QR Code Scanner</h1>
          <p className="text-white/60">Upload an image to decode and extract information from QR codes locally.</p>
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
          title="Upload QR code image"
          description="Supports PNG, JPG, JPEG, WebP"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="space-y-4">
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest px-2">Source Image</span>
            <div className="glass rounded-[40px] overflow-hidden aspect-square relative border border-white/5 bg-black/20">
              <img src={preview!} alt="QR Source" className="w-full h-full object-contain" />
              {isScanning && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <Scan className="text-primary animate-pulse" size={64} />
                    <motion.div 
                      className="absolute inset-0 border-2 border-primary rounded-lg"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <p className="font-bold text-lg">Scanning...</p>
                </div>
              )}
            </div>
          </div>

          {/* Result Area */}
          <div className="space-y-6">
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest px-2">Scan Result</span>
            
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-[40px] border border-white/10 bg-white/5 space-y-6"
              >
                <div className="flex items-center gap-3 text-emerald-400 font-bold text-lg">
                  <QrCode size={24} />
                  <span>QR Code Decoded</span>
                </div>

                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-sm break-all leading-relaxed">
                  {result}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 btn-primary py-4 flex items-center justify-center gap-2"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? 'Copied to Clipboard' : 'Copy Result'}
                  </button>
                  {isUrl(result) && (
                    <a
                      href={result}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass px-6 py-4 rounded-2xl text-white/60 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-[40px] border border-red-500/20 bg-red-500/5 flex flex-col items-center text-center space-y-4"
              >
                <AlertCircle size={48} className="text-red-400" />
                <div className="space-y-2">
                  <p className="font-bold text-lg text-red-400">No QR Code Found</p>
                  <p className="text-white/60 text-sm">{error}</p>
                </div>
                <button 
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="btn-primary bg-white/10 hover:bg-white/20 text-white border-white/10"
                >
                  Try Another Image
                </button>
              </motion.div>
            ) : (
              <div className="glass p-8 rounded-[40px] border border-white/5 bg-black/20 aspect-square flex flex-col items-center justify-center text-white/10">
                <Scan size={64} className="mb-4" />
                <p>Waiting for scan...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
