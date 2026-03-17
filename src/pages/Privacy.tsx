import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, EyeOff, ServerOff } from 'lucide-react';

export default function PrivacyPage() {
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
            Privacy <span className="text-primary">Policy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 leading-relaxed"
          >
            Your data is yours. We keep it that way.
          </motion.p>
        </div>

        {/* Content */}
        <div className="glass p-12 rounded-[40px] space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ServerOff size={20} />
              </div>
              <h2 className="text-2xl font-bold">Local Processing</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              The core philosophy of ModitQuick is that your files should never leave your computer. 
              Most of our tools use WebAssembly and modern browser APIs to process your data entirely locally. 
              Unless explicitly stated otherwise (e.g., for certain AI-powered features that require server-side processing), 
              your files are never uploaded to our servers.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <EyeOff size={20} />
              </div>
              <h2 className="text-2xl font-bold">No Tracking</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              We don't track you. We don't use invasive analytics, we don't sell your data, and we don't build profiles of our users. 
              We may collect minimal, anonymous usage statistics to help us improve the tools, but this never includes your personal data or the content of your files.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Lock size={20} />
              </div>
              <h2 className="text-2xl font-bold">Security</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              By processing files locally, we eliminate the most significant security risk: data in transit and data at rest on third-party servers. 
              Your sensitive documents, private photos, and proprietary code stay exactly where they belong—on your device.
            </p>
          </div>

          <div className="pt-8 border-t border-white/5">
            <p className="text-sm text-white/40 italic">
              Last updated: March 2026. We reserve the right to update this policy as we add new features, but our commitment to your privacy will never change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
