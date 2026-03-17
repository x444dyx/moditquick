import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle, CheckCircle2, Copy, Trash2 } from 'lucide-react';

export default function RegexTester() {
  const [regex, setRegex] = useState('([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+)\\.([a-zA-Z]{2,5})');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Contact us at support@modit.quick or hello@example.com');
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [debouncedRegex, setDebouncedRegex] = useState(regex);
  const [debouncedTestText, setDebouncedTestText] = useState(testText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRegex(regex);
      setDebouncedTestText(testText);
    }, 300);
    return () => clearTimeout(timer);
  }, [regex, testText]);

  useEffect(() => {
    if (!debouncedRegex) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const re = new RegExp(debouncedRegex, flags);
      const m = [];
      let match;

      if (flags.includes('g')) {
        while ((match = re.exec(debouncedTestText)) !== null) {
          m.push(match);
          if (m.length > 1000) break; // Safety limit
        }
      } else {
        match = re.exec(debouncedTestText);
        if (match) m.push(match);
      }

      setMatches(m);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setMatches([]);
    }
  }, [debouncedRegex, flags, debouncedTestText]);

  const highlightMatches = () => {
    if (!debouncedRegex || error) return testText;
    try {
      const re = new RegExp(debouncedRegex, flags);
      // This is a simplified highlighter
      return testText.replace(re, (match) => `<span class="bg-primary/30 text-primary border-b border-primary">${match}</span>`);
    } catch {
      return testText;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Regex Tester</h1>
        <p className="text-white/60">Write and test your regular expressions in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[40px] space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Search size={14} />
                Regular Expression
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">/</span>
                  <input
                    type="text"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                    className="w-full glass rounded-2xl pl-8 pr-4 py-4 font-mono text-sm focus:outline-none focus:border-primary/50"
                    placeholder="pattern"
                  />
                </div>
                <div className="w-20 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/20">/</span>
                  <input
                    type="text"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    className="w-full glass rounded-2xl pl-4 pr-2 py-4 font-mono text-sm focus:outline-none focus:border-primary/50"
                    placeholder="flags"
                  />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs px-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Flags Info</label>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-white/40">
                <div className="glass p-2 rounded-lg">g: global</div>
                <div className="glass p-2 rounded-lg">i: case insensitive</div>
                <div className="glass p-2 rounded-lg">m: multiline</div>
                <div className="glass p-2 rounded-lg">s: dotAll</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Matches</span>
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold">{matches.length}</span>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-auto pr-2">
                {matches.map((match, i) => (
                  <div key={i} className="glass p-3 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/20">Match {i + 1}</span>
                      <span className="text-primary font-mono">{match.index}</span>
                    </div>
                    <div className="font-mono text-white/80 break-all">{match[0]}</div>
                    {match.length > 1 && (
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        {match.slice(1).map((group: string, j: number) => (
                          <div key={j} className="flex gap-2">
                            <span className="text-white/20">Group {j + 1}:</span>
                            <span className="text-emerald-400 font-mono break-all">{group}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Test String</label>
              <button onClick={() => setTestText('')} className="text-xs text-white/20 hover:text-white/40 flex items-center gap-1">
                <Trash2 size={12} /> Clear
              </button>
            </div>
            <div className="relative h-[250px]">
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full h-full glass rounded-[32px] p-8 font-mono text-sm focus:outline-none focus:border-primary/50 resize-none"
                placeholder="Enter text to test against the regex..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest px-2">Visualizer</label>
            <div 
              className="w-full min-h-[250px] glass rounded-[32px] p-8 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightMatches() }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
