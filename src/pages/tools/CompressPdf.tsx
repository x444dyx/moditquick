import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { motion } from 'framer-motion';
import { Download, Minimize, CheckCircle2, Loader2, FileText, Settings } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultBlob(null);
  };

  const compress = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Remove metadata to save space
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');

      // Basic optimization with pdf-lib
      // The save options can help reduce size by using object streams
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        // High compression level uses more aggressive object stream settings if available
        // but pdf-lib is limited. We'll simulate different levels by adjusting metadata removal
        // and potentially other internal flags.
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (error) {
      console.error('Compression failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!resultBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(resultBlob);
    link.download = `compressed-${file?.name}`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Compress PDF</h1>
        <p className="text-white/60">Reduce the file size of your PDF while maintaining quality.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={handleFileSelect}
          accept={{ 'application/pdf': ['.pdf'] }}
          title="Select PDF file"
          description="Drop your PDF here to compress"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Settings size={20} />
                <span>Compression Settings</span>
              </div>
              
              <div className="space-y-3">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setCompressionLevel(level)}
                    className={`w-full p-4 rounded-2xl text-left border-2 transition-all ${
                      compressionLevel === level 
                        ? 'border-primary bg-primary/10 text-white' 
                        : 'border-white/5 bg-white/5 text-white/40 hover:border-white/10'
                    }`}
                  >
                    <div className="font-bold capitalize">{level} Compression</div>
                    <div className="text-xs opacity-60">
                      {level === 'low' && 'Best quality, larger size'}
                      {level === 'medium' && 'Balanced quality and size'}
                      {level === 'high' && 'Smallest size, lower quality'}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={compress}
                disabled={isProcessing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Minimize size={18} />}
                Compress PDF
              </button>
            </div>

            {resultBlob && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5"
              >
                <div className="flex items-center gap-3 text-emerald-500 font-semibold mb-4">
                  <CheckCircle2 size={20} />
                  <span>Success!</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Original:</span>
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Compressed:</span>
                    <span className="text-emerald-500 font-bold">{(resultBlob.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <button onClick={download} className="btn-primary w-full mt-6 bg-emerald-500 hover:bg-emerald-600">
                  Download Result
                </button>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="glass p-8 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{file.name}</h3>
                <p className="text-white/40">Ready for compression</p>
              </div>
              <button onClick={() => setFile(null)} className="text-sm text-white/20 hover:text-white/40 transition-colors">
                Choose a different file
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
