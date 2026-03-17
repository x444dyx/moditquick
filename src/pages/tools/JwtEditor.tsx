import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Copy, Check, Trash2, AlertCircle, Code, List, RefreshCw, ShieldCheck, Save } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';

export default function JwtEditor() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [generatedToken, setGeneratedToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Decode when token changes
  useEffect(() => {
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const h = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
          const p = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          setHeader(JSON.stringify(h, null, 2));
          setPayload(JSON.stringify(p, null, 2));
          setError(null);
        }
      } catch (err) {
        setError('Failed to decode token parts. Make sure it is a valid JWT.');
      }
    }
  }, [token]);

  const base64UrlEncode = (str: string) => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const generateToken = () => {
    try {
      const h = JSON.parse(header);
      const p = JSON.parse(payload);
      const encodedHeader = base64UrlEncode(JSON.stringify(h));
      const encodedPayload = base64UrlEncode(JSON.stringify(p));
      
      // We can't sign it without a secret, so we just show the structure
      setGeneratedToken(`${encodedHeader}.${encodedPayload}.[signature]`);
      setError(null);
    } catch (err: any) {
      setError('Invalid JSON in Header or Payload');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">JWT Editor & Validator</h1>
          <p className="text-white/60">Inspect, edit, and re-encode JWT structures locally. Signature verification is not performed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input/Output Token */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between px-2">
              <label className="text-sm font-medium text-white/40 uppercase tracking-widest">Encoded Token</label>
              <button 
                onClick={() => setToken('')}
                className="text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value.trim())}
              placeholder="Paste JWT to edit..."
              className="w-full glass rounded-2xl p-4 min-h-[150px] focus:outline-none focus:border-primary/50 transition-colors resize-none font-mono text-xs break-all"
            />
            
            <div className="pt-4 border-t border-white/5 space-y-4">
              <button
                onClick={generateToken}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Generate Token
              </button>
              
              {generatedToken && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Generated Output</span>
                    <button 
                      onClick={copyToClipboard}
                      className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] break-all text-white/60">
                    {generatedToken}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          {/* Header Editor */}
          <div className="space-y-3 flex flex-col h-[300px]">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold px-2">
              <Code size={14} />
              Header (JSON)
            </div>
            <div className="flex-1 glass rounded-[32px] overflow-hidden border border-white/5 relative">
              <CodeEditor
                value={header}
                onChange={(v) => setHeader(v || '')}
                language="json"
              />
            </div>
          </div>

          {/* Payload Editor */}
          <div className="space-y-3 flex flex-col h-[400px]">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold px-2">
              <List size={14} />
              Payload (JSON)
            </div>
            <div className="flex-1 glass rounded-[32px] overflow-hidden border border-white/5 relative">
              <CodeEditor
                value={payload}
                onChange={(v) => setPayload(v || '')}
                language="json"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
