import React, { useState, useEffect } from 'react';
import { format, fromUnixTime, getUnixTime, isValid, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, Calendar, Copy, Check, RefreshCw, ArrowRightLeft, AlertCircle, Globe } from 'lucide-react';

export default function UnixTimestamp() {
  const [unixInput, setUnixInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 19));
  const [isMs, setIsMs] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUnixChange = (val: string) => {
    setUnixInput(val);
    const num = parseInt(val);
    if (!isNaN(num)) {
      try {
        const date = isMs ? new Date(num) : fromUnixTime(num);
        if (isValid(date)) {
          setDateInput(date.toISOString().slice(0, 19));
        }
      } catch (e) {}
    }
  };

  const handleDateChange = (val: string) => {
    setDateInput(val);
    try {
      const date = parseISO(val);
      if (isValid(date)) {
        const unix = isMs ? date.getTime() : getUnixTime(date);
        setUnixInput(unix.toString());
      }
    } catch (e) {}
  };

  const setCurrentTime = () => {
    const now = new Date();
    const unix = isMs ? now.getTime() : Math.floor(now.getTime() / 1000);
    setUnixInput(unix.toString());
    setDateInput(now.toISOString().slice(0, 19));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Unix Timestamp Converter</h1>
          <p className="text-white/60">Convert between Unix timestamps and human-readable dates instantly.</p>
        </div>
        <button 
          onClick={setCurrentTime}
          className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Current Time
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Unix to Date */}
        <div className="glass p-8 rounded-[40px] border border-white/10 bg-white/5 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
              <Clock size={14} />
              Unix Timestamp
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 font-bold uppercase">Unit:</span>
              <button 
                onClick={() => setIsMs(!isMs)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  isMs ? 'bg-primary text-white' : 'bg-white/5 text-white/40'
                }`}
              >
                {isMs ? 'MILLISECONDS' : 'SECONDS'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                value={unixInput}
                onChange={(e) => handleUnixChange(e.target.value)}
                className="w-full glass rounded-2xl p-6 text-2xl font-mono focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button 
                onClick={() => copyToClipboard(unixInput, 'unix')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl hover:bg-white/5 text-white/20 hover:text-primary transition-all"
              >
                {copied === 'unix' ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <p className="text-xs text-white/40 px-2">
              {isMs ? '13-digit timestamp (milliseconds)' : '10-digit timestamp (seconds)'}
            </p>
          </div>
        </div>

        {/* Date to Unix */}
        <div className="glass p-8 rounded-[40px] border border-white/10 bg-white/5 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs">
              <Calendar size={14} />
              Human Readable
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase">
              <Globe size={10} />
              UTC Time
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input
                type="datetime-local"
                step="1"
                value={dateInput}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full glass rounded-2xl p-6 text-xl font-mono focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
              />
              <button 
                onClick={() => copyToClipboard(dateInput, 'date')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl hover:bg-white/5 text-white/20 hover:text-emerald-400 transition-all"
              >
                {copied === 'date' ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">GMT/UTC:</span>
                <span className="text-white/80 font-mono">{new Date(dateInput).toUTCString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Local:</span>
                <span className="text-white/80 font-mono">{new Date(dateInput).toString().split(' (')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Helper Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ArrowRightLeft size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">Bidirectional</p>
            <p className="text-sm font-medium">Real-time sync</p>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Globe size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">Timezones</p>
            <p className="text-sm font-medium">UTC & Local support</p>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">Validation</p>
            <p className="text-sm font-medium">ISO 8601 compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
