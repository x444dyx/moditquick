import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Copy, Check, Trash2, Download, Code, Settings, AlertCircle } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';

type Mode = 'yaml-to-json' | 'json-to-yaml';

export default function YamlJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('yaml-to-json');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (input) {
      handleConvert();
    } else {
      setOutput('');
      setError(null);
    }
  }, [input, mode]);

  const handleConvert = () => {
    try {
      if (mode === 'yaml-to-json') {
        const obj = yaml.load(input);
        setOutput(JSON.stringify(obj, null, 2));
      } else {
        const obj = JSON.parse(input);
        setOutput(yaml.dump(obj, { indent: 2 }));
      }
      setError(null);
    } catch (err: any) {
      console.error('Conversion failed:', err);
      setError(err.message || 'Failed to convert data');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = mode === 'yaml-to-json' ? 'json' : 'yaml';
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${new Date().getTime()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">YAML / JSON Converter</h1>
          <p className="text-white/60">Convert structured data between YAML and JSON formats instantly locally.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex p-1 bg-black/20 rounded-2xl border border-white/5">
            <button
              onClick={() => setMode('yaml-to-json')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                mode === 'yaml-to-json' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              YAML → JSON
            </button>
            <button
              onClick={() => setMode('json-to-yaml')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                mode === 'json-to-yaml' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              JSON → YAML
            </button>
          </div>
          <button 
            onClick={() => setInput('')}
            className="glass p-3 rounded-full text-white/40 hover:text-red-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Input Editor */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
              <Code size={14} />
              Input ({mode === 'yaml-to-json' ? 'YAML' : 'JSON'})
            </div>
          </div>
          <div className="flex-1 glass rounded-[40px] overflow-hidden border border-white/5 relative bg-black/20">
            <CodeEditor
              value={input}
              onChange={(v) => setInput(v || '')}
              language={mode === 'yaml-to-json' ? 'yaml' : 'json'}
            />
          </div>
        </div>

        {/* Output Editor */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-bold">
              <ArrowLeftRight size={14} />
              Output ({mode === 'yaml-to-json' ? 'JSON' : 'YAML'})
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
                  onClick={downloadOutput}
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
              language={mode === 'yaml-to-json' ? 'json' : 'yaml'}
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
  );
}
