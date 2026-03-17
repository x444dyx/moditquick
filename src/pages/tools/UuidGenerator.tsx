import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Copy, Check, RefreshCw, Trash2, Plus, List } from 'lucide-react';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  useEffect(() => {
    generateUuids();
  }, []);

  const generateUuids = () => {
    const newUuids = Array.from({ length: quantity }, () => uuidv4());
    setUuids(newUuids);
    setAllCopied(false);
  };

  const copySingle = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    setCopied(uuid);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const clear = () => {
    setUuids([]);
    setAllCopied(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">UUID Generator</h1>
          <p className="text-white/60">Generate secure, random UUIDs (v4) for your development needs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Fingerprint size={20} />
              <span>Generator Options</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm px-2">
                  <label className="text-white/40 uppercase tracking-widest font-medium">Quantity</label>
                  <span className="text-primary font-bold">{quantity}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={generateUuids}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Generate New
              </button>
              <button
                onClick={clear}
                className="w-full py-3 rounded-2xl border border-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Clear List
              </button>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
              <List size={14} />
              Generated UUIDs
            </div>
            {uuids.length > 0 && (
              <button 
                onClick={copyAll}
                className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                {allCopied ? <Check size={14} /> : <Copy size={14} />}
                {allCopied ? 'ALL COPIED' : 'COPY ALL'}
              </button>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {uuids.map((uuid, index) => (
                <motion.div
                  key={uuid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.02 }}
                  className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all"
                >
                  <code className="text-sm font-mono text-white/80 select-all">{uuid}</code>
                  <button
                    onClick={() => copySingle(uuid)}
                    className="p-2 rounded-xl hover:bg-primary/10 text-white/20 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                  >
                    {copied === uuid ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {uuids.length === 0 && (
              <div className="glass p-12 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-white/10 text-center">
                <Fingerprint size={64} className="mb-4" />
                <p className="font-medium">No UUIDs generated</p>
                <p className="text-sm">Click generate to start</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
