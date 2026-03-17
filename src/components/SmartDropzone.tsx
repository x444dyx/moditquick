import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  File as FileIcon, 
  Clipboard,
  Maximize, Minimize2, Crop, RotateCw, FlipHorizontal, Share2, FilePlus, FileMinus, FileImage, FileStack, ArrowUpDown, Minimize, Image, FileCode, Smartphone, Table, Binary, Link as LinkIcon, Palette, FileDiff, Pipette, Globe, Type, Braces, Code2, FileJson, Settings, Database, Search, Zap, Layout, ScanText, QrCode, Scan, Barcode, Hash, Fingerprint, ShieldCheck, ShieldAlert, Clock, CalendarClock, GitCompare, Terminal, CheckCircle2, PenTool, Link2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TOOLS, Tool } from '../context/AppContext';

const ICON_MAP: Record<string, any> = {
  Maximize, Minimize2, Crop, RotateCw, FlipHorizontal, Share2, FilePlus, FileMinus, FileImage, FileStack, ArrowUpDown, Minimize, Image, FileCode, Smartphone, FileText, Table, Code, Binary, Link: LinkIcon, Palette, FileDiff, Pipette, Globe, Type, Braces, Code2, FileJson, Settings, Database, Search, Zap, Layout, ScanText, QrCode, Scan, Barcode, Hash, Fingerprint, ShieldCheck, ShieldAlert, Clock, CalendarClock, GitCompare, Terminal, CheckCircle2, PenTool, Link2
};

interface SmartDropzoneProps {
  onFileSelect?: (file: File) => void;
  accept?: string | string[] | Accept;
  title?: string;
  description?: string;
}

export default function SmartDropzone({ onFileSelect, accept, title, description }: SmartDropzoneProps) {
  const [suggestions, setSuggestions] = useState<Tool[]>([]);
  const navigate = useNavigate();

  const detectAndSuggest = useCallback((input: File | string) => {
    let suggestedTools: Tool[] = [];

    if (input instanceof File) {
      const isImage = input.type.startsWith('image/') || 
                      input.name.toLowerCase().endsWith('.heic') || 
                      input.name.toLowerCase().endsWith('.heif');
      
      if (isImage) {
        suggestedTools = TOOLS.filter(t => t.category === 'image' || t.category === 'converter');
      } else if (input.type === 'application/pdf') {
        suggestedTools = TOOLS.filter(t => t.category === 'pdf');
      } else if (input.name.toLowerCase().endsWith('.docx')) {
        suggestedTools = TOOLS.filter(t => t.id === 'docx-to-pdf');
      } else if (input.name.toLowerCase().endsWith('.json')) {
        suggestedTools = TOOLS.filter(t => t.category === 'editor' && t.id.includes('json') || t.id === 'json-formatter');
      } else if (input.name.toLowerCase().endsWith('.csv')) {
        suggestedTools = TOOLS.filter(t => t.id === 'csv-to-json' || t.id === 'csv-editor');
      } else {
        // Generic fallback for other files
        suggestedTools = TOOLS.filter(t => t.category === 'editor');
      }
    } else {
      // String detection
      try {
        JSON.parse(input);
        suggestedTools = TOOLS.filter(t => t.id === 'json-formatter');
      } catch {
        if (input.startsWith('data:image/')) {
          suggestedTools = TOOLS.filter(t => t.id === 'base64-to-image');
        } else if (input.startsWith('http')) {
          const urlTools = TOOLS.filter(t => t.id === 'url-encoder');
          const isImageUrl = /\.(jpg|jpeg|png|webp|gif|svg|ico)(\?.*)?$/i.test(input);
          if (isImageUrl) {
            const imageTools = TOOLS.filter(t => t.category === 'image' || t.category === 'converter');
            suggestedTools = [...imageTools.slice(0, 3), ...urlTools];
          } else {
            suggestedTools = urlTools;
          }
        }
      }
    }

    setSuggestions(suggestedTools.slice(0, 4));
  }, []);

  const onDrop = useCallback((acceptedFiles: File[], _rejections: any, event: any) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (onFileSelect) {
        onFileSelect(file);
        return;
      }

      detectAndSuggest(file);
    } else if (event && event.dataTransfer && !onFileSelect) {
      const text = event.dataTransfer.getData('text');
      if (text) {
        detectAndSuggest(text);
      }
    }
  }, [detectAndSuggest, onFileSelect]);

  // Handle accept prop conversion
  const getAccept = (): Accept | undefined => {
    if (!accept) return undefined;
    
    // If it's already an Accept object, return it
    if (typeof accept === 'object' && !Array.isArray(accept)) {
      return accept as Accept;
    }

    const result: Accept = {};
    
    const processString = (s: string) => {
      if (s === 'image/*') {
        result['image/*'] = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.heic', '.heif'];
      } else if (s === 'application/pdf') {
        result['application/pdf'] = ['.pdf'];
      } else if (s.includes('/')) {
        // It's a mime type
        result[s] = [];
      } else if (s.startsWith('.')) {
        // It's an extension
        result['application/octet-stream'] = [s];
      }
    };

    if (typeof accept === 'string') {
      processString(accept);
    } else if (Array.isArray(accept)) {
      accept.forEach(processString);
    }

    return Object.keys(result).length > 0 ? result : undefined;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAccept(),
    multiple: false,
  } as any);

  // Clipboard support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const itemsArray = Array.from(items);
      const imageItem = itemsArray.find(item => item.type.startsWith('image/'));
      const textItem = itemsArray.find(item => item.type === 'text/plain');

      if (imageItem) {
        const file = imageItem.getAsFile();
        if (file) {
          if (onFileSelect) onFileSelect(file);
          else detectAndSuggest(file);
        }
      } else if (textItem && !onFileSelect) {
        textItem.getAsString((text) => detectAndSuggest(text));
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [detectAndSuggest, onFileSelect]);

  const displayTitle = title || "Drop anything. Fix it instantly.";
  const displayDescription = description || "Images, PDFs, JSON or Code. Just drop or Cmd + V";

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div 
          {...getRootProps()}
          className={`
            glass rounded-3xl p-12 border-2 border-dashed transition-all duration-500 cursor-pointer group
            ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/10 hover:border-white/20'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center space-y-6 pointer-events-none">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {displayTitle}
              </h2>
              <div className="text-white/60 text-lg">
                {displayDescription}
              </div>
            </div>

            {!title && (
              <div className="flex items-center gap-4 text-sm text-white/40">
                <div className="flex items-center gap-1.5"><ImageIcon size={16} /> Images</div>
                <div className="flex items-center gap-1.5"><FileText size={16} /> PDFs</div>
                <div className="flex items-center gap-1.5"><Code size={16} /> JSON</div>
                <div className="flex items-center gap-1.5"><Clipboard size={16} /> Clipboard</div>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              {suggestions.map((tool) => (
                <motion.button
                  key={tool.id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(tool.path)}
                  className="glass p-4 rounded-2xl text-left glass-hover group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                    {(() => {
                      const Icon = ICON_MAP[tool.icon] || FileIcon;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <h3 className="font-semibold text-sm">{tool.name}</h3>
                  <p className="text-xs text-white/40 mt-1 line-clamp-1">{tool.description}</p>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
