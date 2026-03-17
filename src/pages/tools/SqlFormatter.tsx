import React, { useState, useEffect } from 'react';
import { format } from 'sql-formatter';
import { motion } from 'framer-motion';
import { Database, Copy, Check, Trash2, Download, Sparkles, AlertCircle, Settings } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';

type Dialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'mariadb';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState<Dialect>('sql');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (input) {
      handleFormat();
    } else {
      setOutput('');
      setError(null);
    }
  }, [input, dialect]);

  const handleFormat = () => {
    try {
      const formatted = format(input, {
        language: dialect,
        tabWidth: 2,
        keywordCase: 'upper',
        indentStyle: 'tabularLeft',
      });
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      console.error('SQL Formatting failed:', err);
      setError(err.message || 'Failed to format SQL');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSql = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-query-${new Date().getTime()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const dialects: { id: Dialect; name: string }[] = [
    { id: 'sql', name: 'Standard SQL' },
    { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'mysql', name: 'MySQL' },
    { id: 'sqlite', name: 'SQLite' },
    { id: 'mariadb', name: 'MariaDB' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">SQL Formatter</h1>
          <p className="text-white/60">Beautify and format your SQL queries for better readability locally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Settings size={20} />
              <span>Dialect Settings</span>
            </div>

            <div className="space-y-2">
              {dialects.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDialect(d.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                    dialect === d.id 
                      ? 'bg-primary/10 border-primary text-white' 
                      : 'bg-black/20 border-white/5 text-white/40 hover:border-white/10'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setInput('')}
              className="w-full py-3 rounded-2xl border border-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Clear Input
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 gap-6 h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Input */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                    <Database size={14} />
                    Raw SQL
                  </div>
                </div>
                <div className="flex-1 glass rounded-[40px] overflow-hidden border border-white/5 relative bg-black/20">
                  <CodeEditor
                    value={input}
                    onChange={(v) => setInput(v || '')}
                    language="sql"
                  />
                </div>
              </div>

              {/* Output */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-bold">
                    <Sparkles size={14} />
                    Formatted SQL
                  </div>
                  {output && (
                    <div className="flex gap-3">
                      <button 
                        onClick={copyToClipboard}
                        className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'COPIED' : 'COPY'}
                      </button>
                      <button 
                        onClick={downloadSql}
                        className="text-white/20 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                      >
                        <Download size={14} />
                        DOWNLOAD
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-1 glass rounded-[40px] overflow-hidden border border-white/5 relative bg-black/20">
                  <CodeEditor
                    value={output}
                    onChange={() => {}}
                    language="sql"
                    readOnly={true}
                  />
                  {error && (
                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
