import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck, Settings, Eye, EyeOff } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [strength, setStrength] = useState({ score: 0, label: 'Weak', color: 'text-red-400' });

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ', // Excluded I, O by default if ambiguous is on
      lowercase: 'abcdefghijkmnopqrstuvwxyz', // Excluded l by default if ambiguous is on
      numbers: '23456789', // Excluded 0, 1 by default if ambiguous is on
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    if (!options.excludeAmbiguous) {
      charset.uppercase += 'IO';
      charset.lowercase += 'l';
      charset.numbers += '01';
    }

    let availableChars = '';
    if (options.uppercase) availableChars += charset.uppercase;
    if (options.lowercase) availableChars += charset.lowercase;
    if (options.numbers) availableChars += charset.numbers;
    if (options.symbols) availableChars += charset.symbols;

    if (!availableChars) {
      setPassword('');
      return;
    }

    let generated = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generated += availableChars[array[i] % availableChars.length];
    }

    setPassword(generated);
    calculateStrength(generated);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 8) score += 1;
    if (pwd.length > 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) setStrength({ score, label: 'Weak', color: 'bg-red-400' });
    else if (score <= 4) setStrength({ score, label: 'Medium', color: 'bg-amber-400' });
    else setStrength({ score, label: 'Strong', color: 'bg-emerald-400' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Password Generator</h1>
          <p className="text-white/60">Generate secure, random passwords locally using cryptographically strong methods.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Settings size={20} />
              <span>Configuration</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm px-2">
                  <label className="text-white/40 uppercase tracking-widest font-medium">Length</label>
                  <span className="text-primary font-bold">{length}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  step="1"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-3">
                {Object.entries(options).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 cursor-pointer hover:border-white/10 transition-all group">
                    <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={value} 
                        onChange={() => setOptions(prev => ({ ...prev, [key]: !value }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generatePassword}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Regenerate
            </button>
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-[40px] border border-white/10 bg-white/5 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                <Shield size={14} />
                Generated Password
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Strength:</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${strength.color.replace('bg-', 'text-')}`}>
                  {strength.label}
                </span>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-4 bg-black/40 border border-white/5 rounded-2xl p-6">
                <div className="flex-1 font-mono text-2xl sm:text-3xl tracking-wider break-all text-white/90">
                  {showPassword ? password : '•'.repeat(length)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-3 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-white/5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i}
                    className={`flex-1 transition-all duration-500 ${
                      i <= (strength.score + 1) ? strength.color : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-white/20 text-center uppercase tracking-[0.2em]">
                Entropy-based security indicator
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold">Local Generation</p>
                <p className="text-xs text-white/40">Never leaves your browser</p>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Lock size={24} />
              </div>
              <div>
                <p className="text-sm font-bold">Crypto Secure</p>
                <p className="text-xs text-white/40">Uses window.crypto.getRandomValues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
