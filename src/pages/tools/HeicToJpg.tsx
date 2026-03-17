import React, { useState } from 'react';
import heic2any from 'heic2any';
import { motion } from 'framer-motion';
import { Download, Smartphone, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function HeicToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultUrl(null);
    setError(null);
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });

      const blob = Array.isArray(result) ? result[0] : result;
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('HEIC conversion failed:', err);
      setError('Failed to convert HEIC. Please ensure it is a valid HEIC file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${file?.name.split('.')[0]}.jpg`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">HEIC to JPG</h1>
        <p className="text-white/60">Convert iPhone HEIC photos to standard JPG format instantly.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept={{ 'image/heic': ['.heic'], 'image/heif': ['.heif'] }}
          title="Select HEIC image"
          description="Drop your .heic or .heif file here"
        />
      ) : (
        <div className="space-y-8">
          <div className="glass p-8 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
              <Smartphone size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{file.name}</h3>
              <p className="text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB • HEIC Format</p>
            </div>

            {!resultUrl ? (
              <button
                onClick={convert}
                disabled={isProcessing}
                className="btn-primary px-12 py-4 text-lg flex items-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <ImageIcon size={20} />
                    Convert to JPG
                  </>
                )}
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 w-full max-w-sm"
              >
                <div className="flex items-center gap-2 text-emerald-500 font-bold">
                  <CheckCircle2 size={24} />
                  Conversion Complete
                </div>
                <button onClick={download} className="btn-primary w-full py-4 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600">
                  <Download size={20} />
                  Download JPG
                </button>
                <button onClick={() => setFile(null)} className="text-sm text-white/20 hover:text-white/40">
                  Convert another
                </button>
              </motion.div>
            )}

            {error && (
              <p className="text-red-400 text-sm font-medium">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
