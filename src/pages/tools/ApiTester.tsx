import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Send, Copy, Check, Trash2, AlertCircle, Code, List, Clock, ShieldAlert, Loader2 } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export default function ApiTester() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<Method>('GET');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('{\n  "key": "value"\n}');
  const [response, setResponse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sendRequest = async () => {
    if (!url) return;
    setIsProcessing(true);
    setError(null);
    setResponse(null);

    try {
      const parsedHeaders = JSON.parse(headers);
      const parsedBody = method !== 'GET' ? JSON.parse(body) : undefined;

      const startTime = Date.now();
      const res = await axios({
        url,
        method,
        headers: parsedHeaders,
        data: parsedBody,
        validateStatus: () => true, // Don't throw on 4xx/5xx
      });
      const endTime = Date.now();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data,
        time: endTime - startTime,
        size: JSON.stringify(res.data).length
      });
    } catch (err: any) {
      console.error('Request failed:', err);
      setError(err.message || 'Request failed. Check console for details.');
      if (err.message.includes('Network Error')) {
        setError('Network Error: This is likely a CORS issue. The API must allow requests from this domain.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const copyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methods: Method[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">API Request Tester</h1>
          <p className="text-white/60">Test HTTP requests directly from your browser. Subject to CORS restrictions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Panel */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as Method)}
                  className="appearance-none glass rounded-2xl px-6 py-4 pr-12 font-bold text-primary focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                  {methods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/data"
                className="flex-1 glass rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
              />
              <button
                onClick={sendRequest}
                disabled={!url || isProcessing}
                className="btn-primary px-8 rounded-2xl flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {isProcessing ? 'Sending...' : 'Send'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Headers Editor */}
              <div className="space-y-3 flex flex-col h-[200px]">
                <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold px-2">
                  <List size={12} />
                  Headers (JSON)
                </div>
                <div className="flex-1 glass rounded-2xl overflow-hidden border border-white/5 relative">
                  <CodeEditor
                    value={headers}
                    onChange={(v) => setHeaders(v || '')}
                    language="json"
                  />
                </div>
              </div>

              {/* Body Editor */}
              {method !== 'GET' && (
                <div className="space-y-3 flex flex-col h-[250px]">
                  <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold px-2">
                    <Code size={12} />
                    Request Body (JSON)
                  </div>
                  <div className="flex-1 glass rounded-2xl overflow-hidden border border-white/5 relative">
                    <CodeEditor
                      value={body}
                      onChange={(v) => setBody(v || '')}
                      language="json"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
            <ShieldAlert className="text-amber-500 flex-shrink-0" size={20} />
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-500">CORS Restriction</p>
              <p className="text-xs text-white/40 leading-relaxed">
                Requests are made from your browser. If the target API does not support CORS (Cross-Origin Resource Sharing), the request will fail.
              </p>
            </div>
          </div>
        </div>

        {/* Response Panel */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
              <Globe size={14} />
              Response
            </div>
            {response && (
              <button 
                onClick={copyResponse}
                className="text-primary hover:text-primary-light transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'COPIED' : 'COPY BODY'}
              </button>
            )}
          </div>

          <div className="flex-1 glass rounded-[40px] border border-white/5 bg-black/20 overflow-hidden flex flex-col">
            {response ? (
              <div className="flex flex-col h-full">
                {/* Response Meta */}
                <div className="p-6 border-b border-white/5 flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Status</span>
                    <span className={`text-lg font-bold ${response.status >= 200 && response.status < 300 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {response.status} {response.statusText}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Time</span>
                    <span className="text-lg font-bold text-white/80">{response.time}ms</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Size</span>
                    <span className="text-lg font-bold text-white/80">{(response.size / 1024).toFixed(2)} KB</span>
                  </div>
                </div>

                {/* Response Body */}
                <div className="flex-1 relative">
                  <CodeEditor
                    value={typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : String(response.data)}
                    onChange={() => {}}
                    language="json"
                    readOnly={true}
                  />
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                <AlertCircle size={64} className="text-red-400/20" />
                <div className="space-y-2">
                  <p className="font-bold text-red-400">Request Failed</p>
                  <p className="text-sm text-white/40 max-w-md">{error}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-white/10 text-center">
                <Send size={64} className="mb-4" />
                <p className="text-lg font-medium">Ready to test</p>
                <p className="text-sm">Configure your request and click Send</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
