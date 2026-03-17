import React, { useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { Download, Table, CheckCircle2, Copy, FileJson, AlertCircle } from 'lucide-react';

export default function JsonToCsv() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const convert = () => {
    setError(null);
    setCsvOutput('');
    
    try {
      const parsed = JSON.parse(jsonInput);
      const data = Array.isArray(parsed) ? parsed : [parsed];
      
      if (data.length === 0) {
        setError('JSON array is empty');
        return;
      }

      const csv = Papa.unparse(data);
      setCsvOutput(csv);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(csvOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted.csv';
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">JSON to CSV</h1>
        <p className="text-white/60">Convert JSON arrays into clean CSV files for spreadsheets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <FileJson size={14} />
              JSON Input
            </label>
            <button 
              onClick={() => setJsonInput('')}
              className="text-xs text-white/20 hover:text-white/40"
            >
              Clear
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
            className="w-full h-[400px] glass rounded-3xl p-6 font-mono text-sm focus:outline-none focus:border-primary/50 resize-none"
          />
          <button
            onClick={convert}
            disabled={!jsonInput.trim()}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Table size={20} />
            Convert to CSV
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
              <Table size={14} />
              CSV Output
            </label>
            {csvOutput && (
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
            {csvOutput ? (
              csvOutput
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                <Table size={48} className="mb-4" />
                <p>Output will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
