import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, Globe, ArrowRight } from 'lucide-react';
import SmartDropzone from '../components/SmartDropzone';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-sm font-medium mb-4"
          >
            <Zap size={14} className="fill-primary" />
            <span>70+ tools. Zero setup.</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Drop anything. <br />
            <span className="text-primary">Fix it instantly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Fast tools for images, PDFs, files, and code. Edit, convert, and optimize everything — all in your browser. 
            No uploads, no accounts, 100% private.
          </motion.p>

          <div className="pt-12">
            <SmartDropzone />
          </div>
        </div>

        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 glass border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">Privacy First</h3>
            <p className="text-white/50 leading-relaxed">
              Your files never leave your computer. All processing happens locally in your browser using WebAssembly.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold">Blazing Fast</h3>
            <p className="text-white/50 leading-relaxed">
              Optimized with multi-threading and GPU acceleration for near-instant results even on large files.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold">Universal</h3>
            <p className="text-white/50 leading-relaxed">
              One tool for everything. From image conversion to PDF merging and developer utilities.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto glass rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to speed up your workflow?</h2>
            <p className="text-lg text-white/60">
              Join thousands of creators who use ModitQuick every day to get things done faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/tools" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                Browse All Tools <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[80px] -ml-32 -mb-32" />
        </div>
      </section>
    </div>
  );
}
