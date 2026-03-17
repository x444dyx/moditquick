import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
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
            Terms of <span className="text-primary">Service</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 leading-relaxed"
          >
            Simple, clear, and fair.
          </motion.p>
        </div>

        {/* Content */}
        <div className="glass p-12 rounded-[40px] space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-2xl font-bold">Usage</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              ModitQuick is provided as a free-to-use toolbox for personal and professional use. 
              You are free to use these tools to process any content you have the rights to. 
              You are solely responsible for the content you process and how you use the results.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-2xl font-bold">Disclaimer</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              These tools are provided "as is" without any warranties, express or implied. 
              While we strive for 100% accuracy and reliability, we do not guarantee that the service will be uninterrupted or error-free. 
              AyTee Labs is not liable for any data loss or damages resulting from the use of these tools.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Scale size={20} />
              </div>
              <h2 className="text-2xl font-bold">Fair Use</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              We reserve the right to limit or block access to the service if we detect abusive behavior, 
              automated scraping, or any activity that compromises the stability and availability of the tools for other users.
            </p>
          </div>

          <div className="pt-8 border-t border-white/5">
            <p className="text-sm text-white/40 italic">
              Last updated: March 2026. By using ModitQuick, you agree to these terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
