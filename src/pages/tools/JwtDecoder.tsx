import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { ShieldCheck, Copy, Check, Trash2, AlertCircle, Code, List, Clock } from 'lucide-react';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      decodeToken();
    } else {
      setHeader(null);
      setPayload(null);
      setError(null);
    }
  }, [token]);

  const decodeToken = () => {
    try {
      // JWT is Header.Payload.Signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. A token must have 3 parts separated by dots.');
      }

      const decodedHeader = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const decodedPayload = jwtDecode(token);

      setHeader(decodedHeader);
      setPayload(decodedPayload);
      setError(null);
    } catch (err: any) {
      console.error('JWT Decode failed:', err);
      setError(err.message || 'Invalid JWT token');
      setHeader(null);
      setPayload(null);
    }
  };

  const copyToClipboard = (data: any, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatTimestamp = (ts: number) => {
    return new Date(ts * 1000).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">JWT Decoder</h1>
          <p className="text-white/60">Decode and inspect JSON Web Tokens locally. No data is ever sent to a server.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-6">
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
              placeholder="Paste your JWT token here..."
              className="w-full glass rounded-2xl p-6 min-h-[250px] focus:outline-none focus:border-primary/50 transition-colors resize-none font-mono text-sm break-all"
            />
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 bg-white/5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck size={18} />
              <span>Security Note</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              This tool decodes the token structure locally in your browser. It does not verify the signature. 
              Signature verification requires a secret or public key.
            </p>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                <Code size={14} />
                Header
              </div>
              {header && (
                <button 
                  onClick={() => copyToClipboard(header, 'header')}
                  className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  {copied === 'header' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'header' ? 'COPIED' : 'COPY'}
                </button>
              )}
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 bg-black/20 font-mono text-sm overflow-auto max-h-[200px]">
              {header ? (
                <pre className="text-emerald-400">{JSON.stringify(header, null, 2)}</pre>
              ) : (
                <span className="text-white/10 italic">Waiting for token...</span>
              )}
            </div>
          </div>

          {/* Payload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                <List size={14} />
                Payload
              </div>
              {payload && (
                <button 
                  onClick={() => copyToClipboard(payload, 'payload')}
                  className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  {copied === 'payload' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'payload' ? 'COPIED' : 'COPY'}
                </button>
              )}
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 bg-black/20 font-mono text-sm overflow-auto max-h-[400px]">
              {payload ? (
                <div className="space-y-4">
                  <pre className="text-primary-light">{JSON.stringify(payload, null, 2)}</pre>
                  
                  {/* Common Claims Helper */}
                  <div className="border-t border-white/5 pt-4 space-y-2">
                    {payload.iat && (
                      <div className="flex items-center gap-2 text-[10px] text-white/30">
                        <Clock size={10} />
                        <span>Issued At: {formatTimestamp(payload.iat)}</span>
                      </div>
                    )}
                    {payload.exp && (
                      <div className="flex items-center gap-2 text-[10px] text-white/30">
                        <Clock size={10} />
                        <span>Expires: {formatTimestamp(payload.exp)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-white/10 italic">Waiting for token...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
