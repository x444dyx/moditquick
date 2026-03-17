import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  FileCode,
  Code2,
  Braces,
  FileJson
} from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';
import { formatCode, minifyCode } from '../../utils/formatter';

type Language = 'javascript' | 'css' | 'html' | 'json';

export default function MinifyBeautify() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = React.useCallback((v: string | undefined) => setInput(v || ''), []);

  const handleAction = async (type: 'beautify' | 'minify') => {
    setLoading(true);
    try {
      if (type === 'beautify') {
        const formatted = await formatCode(input, language);
        setOutput(formatted);
      } else {
        const minified = minifyCode(input, language);
        setOutput(minified);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const extensions = { javascript: 'js', css: 'css', html: 'html', json: 'json' };
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modit-export.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: <FileCode size={16} /> },
    { id: 'css', name: 'CSS', icon: <Code2 size={16} /> },
    { id: 'html', name: 'HTML', icon: <Braces size={16} /> },
    { id: 'json', name: 'JSON', icon: <FileJson size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Minify & Beautify</h1>
          <p className="text-white/60">Clean or compress your code instantly. Supports HTML, CSS, JS, and JSON.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleAction('beautify')}
            disabled={!input || loading}
            className="btn-primary py-2 px-6 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} />
            Beautify
          </button>
          <button 
            onClick={() => handleAction('minify')}
            disabled={!input || loading}
            className="glass px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Zap size={16} className="text-emerald-400" />
            Minify
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Input */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Input</span>
              <div className="flex gap-1 ml-4">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as Language)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      language === lang.id ? 'bg-primary text-white' : 'text-white/20 hover:text-white/40'
                    }`}
                  >
                    {lang.icon}
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setInput('')}
              className="text-white/20 hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex-1 bg-[#1e1e1e] rounded-[40px] overflow-hidden relative border border-white/5 shadow-2xl">
            <CodeEditor 
              value={input} 
              onChange={handleInputChange} 
              language={language} 
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Output</span>
            {output && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-light transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button 
                  onClick={downloadFile}
                  className="text-white/20 hover:text-white/60 transition-colors"
                >
                  <Download size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 bg-[#1e1e1e] rounded-[40px] overflow-hidden relative border border-white/5 shadow-2xl">
            <CodeEditor 
              value={output} 
              onChange={() => {}} 
              language={language} 
              readOnly={true}
            />
            {!output && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 pointer-events-none">
                <Sparkles size={48} className="mb-4" />
                <p>Output will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
