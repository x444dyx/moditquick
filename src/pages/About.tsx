import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Cpu, Globe, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-32 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Hero */}
        <div className="text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            About <span className="text-primary">ModitQuick</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 leading-relaxed"
          >
            Fast, private browser tools for files, PDFs, images, and code.
          </motion.p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-3xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">Speed & Convenience</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              ModitQuick is built for speed. No accounts, no uploads, no waiting. Just drop your file and get the job done instantly in your browser.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-8 rounded-3xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">Privacy First</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Your data never leaves your computer. We use modern web technologies like WebAssembly to process everything locally, ensuring 100% privacy.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-8 rounded-3xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold">Universal Toolbox</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              From image conversion to PDF merging and developer utilities, we're building a comprehensive toolbox for every digital task.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-8 rounded-3xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Heart size={24} />
            </div>
            <h3 className="text-xl font-bold">Built for You</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              We believe tools should be simple, accessible, and respectful of your time and data. ModitQuick is our contribution to a better web.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-12 rounded-[40px] text-center space-y-6"
        >
          <h2 className="text-2xl font-bold">
            A product by <a href="https://www.ayteelabs.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all">AyTee Labs</a>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Fast, private browser tools for files, PDFs, images, and code.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
