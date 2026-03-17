import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Copy, Check, Trash2, Image as ImageIcon } from 'lucide-react';

export default function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Image to Base64</h1>
        <p className="text-white/60">Convert any image into a base64 encoded string for embedding in code.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-sm font-medium text-white/40 px-2">Upload Image</label>
          {!file ? (
            <label className="glass rounded-[40px] border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-20 group h-80">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold">Select Image</h3>
            </label>
          ) : (
            <div className="glass rounded-[40px] overflow-hidden h-80 relative group">
              <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-contain p-4" />
              <button 
                onClick={() => { setFile(null); setBase64(''); }}
                className="absolute top-4 right-4 p-2 glass rounded-full text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-medium text-white/40">Base64 Output</label>
            {base64 && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-light transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy String'}
              </button>
            )}
          </div>
          <div className="glass rounded-3xl overflow-hidden h-80">
            <textarea
              readOnly
              value={base64}
              placeholder="Base64 string will appear here..."
              className="w-full h-full bg-transparent p-6 font-mono text-[10px] focus:outline-none resize-none text-white/60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
