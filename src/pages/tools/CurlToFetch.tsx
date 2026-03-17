import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, Trash2, Code, Zap, AlertCircle } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';

export default function CurlToFetch() {
  const [curl, setCurl] = useState('');
  const [fetchCode, setFetchCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (curl) {
      convertCurl();
    } else {
      setFetchCode('');
      setError(null);
    }
  }, [curl]);

  const convertCurl = () => {
    try {
      if (!curl.trim().startsWith('curl')) {
        throw new Error('Input must start with "curl"');
      }

      const urlMatch = curl.match(/['"]?(https?:\/\/[^'"]+)['"]?/);
      if (!urlMatch) throw new Error('Could not find URL in cURL command');
      const url = urlMatch[1];

      const methodMatch = curl.match(/-X\s+([A-Z]+)/) || curl.match(/--request\s+([A-Z]+)/);
      const method = methodMatch ? methodMatch[1] : 'GET';

      const headers: Record<string, string> = {};
      const headerMatches = curl.matchAll(/-H\s+['"]([^'"]+)['"]/g);
      for (const match of headerMatches) {
        const [key, ...valueParts] = match[1].split(':');
        headers[key.trim()] = valueParts.join(':').trim();
      }

      const bodyMatch = curl.match(/-d\s+['"]([^'"]+)['"]/) || curl.match(/--data\s+['"]([^'"]+)['"]/);
      const body = bodyMatch ? bodyMatch[1] : null;

      let code = `fetch('${url}', {\n`;
      code += `  method: '${method}',\n`;
      
      if (Object.keys(headers).length > 0) {
        code += `  headers: {\n`;
        Object.entries(headers).forEach(([key, value]) => {
          code += `    '${key}': '${value}',\n`;
        });
        code += `  },\n`;
      }

      if (body) {
        code += `  body: JSON.stringify(${body}),\n`;
      }

      code += `})\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error('Error:', error));`;

      setFetchCode(code);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to parse cURL command');
      setFetchCode('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fetchCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">cURL to fetch Converter</h1>
          <p className="text-white/60">Convert cURL commands into clean JavaScript fetch code instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Input Area */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
              <Terminal size={14} />
              cURL Command
            </div>
            <button 
              onClick={() => setCurl('')}
              className="text-white/20 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex-1 glass rounded-[40px] overflow-hidden border border-white/5 relative bg-black/20">
            <CodeEditor
              value={curl}
              onChange={(v) => setCurl(v || '')}
              language="shell"
            />
            {!curl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 pointer-events-none p-8 text-center">
                <Terminal size={64} className="mb-4" />
                <p className="font-medium">Paste your cURL command here</p>
                <p className="text-xs mt-2 opacity-60">Example: curl -X POST https://api.example.com -H "Content-Type: application/json" -d '&#123;"key": "value"&#125;'</p>
              </div>
            )}
          </div>
        </div>

        {/* Output Area */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-xs font-bold">
              <Zap size={14} />
              Fetch Code
            </div>
            {fetchCode && (
              <button 
                onClick={copyToClipboard}
                className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'COPIED' : 'COPY CODE'}
              </button>
            )}
          </div>
          <div className="flex-1 glass rounded-[40px] overflow-hidden border border-white/5 relative bg-black/20">
            <CodeEditor
              value={fetchCode}
              onChange={() => {}}
              language="javascript"
              readOnly={true}
            />
            {error && (
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {!fetchCode && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 pointer-events-none">
                <Code size={64} className="mb-4" />
                <p className="font-medium">Fetch code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
