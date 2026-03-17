import React, { useState, useEffect } from 'react';
import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';
import { motion } from 'framer-motion';
import { CalendarClock, Copy, Check, Info, AlertCircle, List, Clock, Trash2 } from 'lucide-react';

export default function CronParser() {
  const [cron, setCron] = useState('0 0 * * *');
  const [explanation, setExplanation] = useState('');
  const [nextDates, setNextDates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    parseCron();
  }, [cron]);

  const parseCron = () => {
    if (!cron.trim()) {
      setExplanation('');
      setNextDates([]);
      setError(null);
      return;
    }

    try {
      // Get human readable explanation
      const desc = cronstrue.toString(cron);
      setExplanation(desc);

      // Get next execution dates
      const interval = (cronParser as any).parseExpression(cron);
      const dates = [];
      for (let i = 0; i < 5; i++) {
        dates.push(interval.next().toString());
      }
      setNextDates(dates);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid cron expression');
      setExplanation('');
      setNextDates([]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cron);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
    { label: 'Every 15 minutes', value: '*/15 * * * *' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Cron Expression Parser</h1>
          <p className="text-white/60">Parse, validate, and explain cron schedules in plain English.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between px-2">
              <label className="text-sm font-medium text-white/40 uppercase tracking-widest">Cron Expression</label>
              <button 
                onClick={() => setCron('')}
                className="text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="relative group">
              <input
                type="text"
                value={cron}
                onChange={(e) => setCron(e.target.value)}
                placeholder="* * * * *"
                className="w-full glass rounded-2xl p-4 text-xl font-mono focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button 
                onClick={copyToClipboard}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-primary transition-all"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2">Common Examples</p>
              <div className="space-y-2">
                {examples.map((ex) => (
                  <button
                    key={ex.value}
                    onClick={() => setCron(ex.value)}
                    className="w-full text-left p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <p className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{ex.label}</p>
                    <code className="text-[10px] text-primary font-mono">{ex.value}</code>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-[40px] border border-white/10 bg-white/5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold px-2">
                <Info size={14} />
                Human Readable Schedule
              </div>
              <div className="p-8 rounded-3xl bg-black/40 border border-white/5 text-2xl font-medium text-white/90 leading-relaxed">
                {explanation || (error ? 'Invalid Expression' : 'Waiting for input...')}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold px-2">
                <Clock size={14} />
                Next Execution Times
              </div>
              <div className="grid grid-cols-1 gap-2">
                {nextDates.length > 0 ? (
                  nextDates.map((date, i) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all"
                    >
                      <span className="text-xs font-bold text-white/20 w-4">{i + 1}</span>
                      <span className="text-sm font-mono text-white/80">{date}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/10">
                    <CalendarClock size={48} className="mb-2" />
                    <p className="text-sm">No upcoming dates to show</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
