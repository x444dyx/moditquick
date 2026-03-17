import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Download, 
  Layout, 
  Code2, 
  Palette, 
  FileCode,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';

export default function CodePlayground() {
  const [html, setHtml] = useState('<h1>Hello ModitQuick!</h1>\n<p>Start editing to see changes live.</p>\n<button id="btn">Click Me</button>');
  const [css, setCss] = useState('body {\n  font-family: sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  margin: 0;\n  background: #0f172a;\n  color: white;\n}\n\nbutton {\n  padding: 12px 24px;\n  border-radius: 12px;\n  border: none;\n  background: #6366f1;\n  color: white;\n  font-weight: bold;\n  cursor: pointer;\n  transition: transform 0.2s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n}');
  const [js, setJs] = useState('const btn = document.getElementById("btn");\n\nbtn.addEventListener("click", () => {\n  alert("ModitQuick Playground is awesome!");\n  btn.style.background = "#10b981";\n});');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [previewSize, setPreviewSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [srcDoc, setSrcDoc] = useState('');

  const updatePreview = useCallback(() => {
    const combined = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
      </html>
    `;
    setSrcDoc(combined);
  }, [html, css, js]);

  useEffect(() => {
    const timeout = setTimeout(updatePreview, 500);
    return () => clearTimeout(timeout);
  }, [updatePreview]);

  const handleHtmlChange = useCallback((v: string | undefined) => setHtml(v || ''), []);
  const handleCssChange = useCallback((v: string | undefined) => setCss(v || ''), []);
  const handleJsChange = useCallback((v: string | undefined) => setJs(v || ''), []);

  const reset = () => {
    if (confirm('Are you sure you want to reset the playground?')) {
      setHtml('<h1>Hello ModitQuick!</h1>');
      setCss('body { font-family: sans-serif; }');
      setJs('');
    }
  };

  const downloadProject = () => {
    const combined = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ModitQuick Playground Export</title>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>`;
    const blob = new Blob([combined], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modit-playground.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'html', name: 'HTML', icon: <Code2 size={16} />, color: 'text-orange-400' },
    { id: 'css', name: 'CSS', icon: <Palette size={16} />, color: 'text-blue-400' },
    { id: 'js', name: 'JS', icon: <FileCode size={16} />, color: 'text-yellow-400' },
  ];

  const sizes = [
    { id: 'desktop', icon: <Monitor size={16} />, width: '100%' },
    { id: 'tablet', icon: <Tablet size={16} />, width: '768px' },
    { id: 'mobile', icon: <Smartphone size={16} />, width: '375px' },
  ];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-[#07101F]">
      {/* Toolbar */}
      <div className="glass border-b border-white/5 px-6 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Layout size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg">Playground</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <span className={activeTab === tab.id ? tab.color : ''}>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass p-1 rounded-xl flex gap-1 mr-4">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setPreviewSize(size.id as any)}
                className={`p-1.5 rounded-lg transition-all ${
                  previewSize === size.id ? 'bg-white/10 text-primary' : 'text-white/20 hover:text-white/40'
                }`}
                title={size.id}
              >
                {size.icon}
              </button>
            ))}
          </div>
          <button onClick={reset} className="glass p-2 rounded-xl text-white/40 hover:text-red-400 transition-colors" title="Reset">
            <RotateCcw size={18} />
          </button>
          <button onClick={downloadProject} className="btn-primary px-6 py-2 flex items-center gap-2 text-sm">
            <Download size={16} />
            Export HTML
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="w-1/2 border-r border-white/5 bg-[#1e1e1e] flex flex-col">
          <div className="flex-1 relative">
            <div className={`absolute inset-0 ${activeTab === 'html' ? 'block' : 'hidden'}`}>
              <CodeEditor value={html} onChange={handleHtmlChange} language="html" />
            </div>
            <div className={`absolute inset-0 ${activeTab === 'css' ? 'block' : 'hidden'}`}>
              <CodeEditor value={css} onChange={handleCssChange} language="css" />
            </div>
            <div className={`absolute inset-0 ${activeTab === 'js' ? 'block' : 'hidden'}`}>
              <CodeEditor value={js} onChange={handleJsChange} language="javascript" />
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="w-1/2 bg-white/5 flex flex-col items-center justify-center p-8 overflow-hidden">
          <div 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
            style={{ 
              width: sizes.find(s => s.id === previewSize)?.width,
              height: '100%',
              maxWidth: '100%'
            }}
          >
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4 bg-white rounded-md text-[10px] text-gray-400 py-1 px-3 truncate">
                http://modit-playground.local
              </div>
            </div>
            <iframe
              srcDoc={srcDoc}
              title="Preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
