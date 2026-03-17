import React, { useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { Download, Code, CheckCircle2, Copy, Table, AlertCircle } from 'lucide-react';

export default function CsvToJson() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const convert = () => {
    setError(null);
    setJsonOutput('');
    
    Papa.parse(csvInput, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV. Please check your data.');
          return;
        }
        setJsonOutput(JSON.stringify(results.data, null, 2));
      },
      error: (err) => {
        setError('Failed to parse CSV: ' + err.message);
      }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted.json';
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">CSV to JSON</h1>
        <p className="text-white/60">Convert CSV data into structured JSON objects instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Table size={14} />
              CSV Input
            </label>
            <button 
              onClick={() => setCsvInput('')}
              className="text-xs text-white/20 hover:text-white/40"
            >
              Clear
            </button>
          </div>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder="name,age,city&#10;John,30,New York&#10;Jane,25,London"
            className="w-full h-[400px] glass rounded-3xl p-6 font-mono text-sm focus:outline-none focus:border-primary/50 resize-none"
          />
          <button
            onClick={convert}
            disabled={!csvInput.trim()}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Code size={20} />
            Convert to JSON
          </button>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm px-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Code size={14} />
              JSON Output
            </label>
            {jsonOutput && (
              <div className="flex gap-4">
                <button onClick={copyToClipboard} className="text-xs text-primary hover:underline flex items-center gap-1">
                  {isCopied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={download} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Download size={12} />
                  Download
                </button>
              </div>
            )}
          </div>
          <div className="w-full h-[400px] glass rounded-3xl p-6 font-mono text-sm overflow-auto whitespace-pre relative">
            {jsonOutput ? (
              jsonOutput
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                <Code size={48} className="mb-4" />
                <p>Output will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
