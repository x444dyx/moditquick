import { createContext, useContext, useState, ReactNode } from 'react';

export type ToolCategory = 'image' | 'pdf' | 'developer' | 'creator' | 'converter' | 'editor';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  path: string;
}

export const TOOLS: Tool[] = [
  // Image Tools
  { id: 'resize-image', name: 'Resize Image', description: 'Change dimensions of your images', category: 'image', icon: 'Maximize', path: '/tools/resize-image' },
  { id: 'compress-image', name: 'Compress Image', description: 'Reduce file size without losing quality', category: 'image', icon: 'Minimize2', path: '/tools/compress-image' },
  { id: 'crop-image', name: 'Crop Image', description: 'Cut and trim your images visually', category: 'image', icon: 'Crop', path: '/tools/crop-image' },
  { id: 'rotate-image', name: 'Rotate Image', description: 'Rotate images by any angle', category: 'image', icon: 'RotateCw', path: '/tools/rotate-image' },
  { id: 'flip-image', name: 'Flip Image', description: 'Flip images horizontally or vertically', category: 'image', icon: 'FlipHorizontal', path: '/tools/flip-image' },
  { id: 'social-resizer', name: 'Social Media Resizer', description: 'Resize images for Instagram, Twitter, etc.', category: 'image', icon: 'Share2', path: '/tools/social-resizer' },
  
  // PDF Tools
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files into one', category: 'pdf', icon: 'FilePlus', path: '/tools/merge-pdf' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Extract pages from your PDF file', category: 'pdf', icon: 'FileMinus', path: '/tools/split-pdf' },
  { id: 'pdf-to-images', name: 'PDF to Images', description: 'Convert PDF pages into image files', category: 'pdf', icon: 'FileImage', path: '/tools/pdf-to-images' },
  { id: 'images-to-pdf', name: 'Images to PDF', description: 'Convert multiple images into a single PDF', category: 'pdf', icon: 'FileStack', path: '/tools/images-to-pdf' },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate pages in your PDF document', category: 'pdf', icon: 'RotateCw', path: '/tools/rotate-pdf' },
  { id: 'reorder-pdf', name: 'Reorder PDF', description: 'Rearrange pages in your PDF file', category: 'pdf', icon: 'ArrowUpDown', path: '/tools/reorder-pdf' },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size significantly', category: 'pdf', icon: 'Minimize', path: '/tools/compress-pdf' },
  
  // Converter Tools
  { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG images to JPG format', category: 'converter', icon: 'Image', path: '/tools/png-to-jpg' },
  { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG images to PNG format', category: 'converter', icon: 'Image', path: '/tools/jpg-to-png' },
  { id: 'png-to-webp', name: 'PNG to WebP', description: 'Convert PNG images to WebP format', category: 'converter', icon: 'Zap', path: '/tools/png-to-webp' },
  { id: 'jpg-to-webp', name: 'JPG to WebP', description: 'Convert JPG images to WebP format', category: 'converter', icon: 'Zap', path: '/tools/jpg-to-webp' },
  { id: 'webp-to-jpg', name: 'WebP to JPG', description: 'Convert WebP images to JPG format', category: 'converter', icon: 'Image', path: '/tools/webp-to-jpg' },
  { id: 'webp-to-png', name: 'WebP to PNG', description: 'Convert WebP images to PNG format', category: 'converter', icon: 'Image', path: '/tools/webp-to-png' },
  { id: 'svg-to-png', name: 'SVG to PNG', description: 'Convert SVG vectors to PNG images', category: 'converter', icon: 'FileCode', path: '/tools/svg-to-png' },
  { id: 'heic-to-jpg', name: 'HEIC to JPG', description: 'Convert iPhone HEIC images to JPG', category: 'converter', icon: 'Smartphone', path: '/tools/heic-to-jpg' },
  { id: 'docx-to-pdf', name: 'DOCX to PDF', description: 'Convert Word documents to PDF', category: 'converter', icon: 'FileText', path: '/tools/docx-to-pdf' },
  { id: 'json-to-csv', name: 'JSON to CSV', description: 'Convert JSON data to CSV format', category: 'converter', icon: 'Table', path: '/tools/json-to-csv' },
  { id: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV data to JSON format', category: 'converter', icon: 'Code', path: '/tools/csv-to-json' },

  // Developer Tools
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Clean and format messy JSON code', category: 'developer', icon: 'Code', path: '/tools/json-formatter' },
  { id: 'base64-to-image', name: 'Base64 to Image', description: 'Convert base64 strings back to images', category: 'developer', icon: 'Binary', path: '/tools/base64-to-image' },
  { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Safely encode or decode URLs', category: 'developer', icon: 'Link', path: '/tools/url-encoder' },
  { id: 'image-to-base64', name: 'Image to Base64', description: 'Convert images to base64 strings', category: 'developer', icon: 'Code', path: '/tools/image-to-base64' },
  { id: 'hex-to-rgb', name: 'HEX to RGB', description: 'Convert HEX colors to RGB format', category: 'developer', icon: 'Palette', path: '/tools/hex-to-rgb' },
  { id: 'rgb-to-hex', name: 'RGB to HEX', description: 'Convert RGB colors to HEX format', category: 'developer', icon: 'Palette', path: '/tools/rgb-to-hex' },
  { id: 'text-diff', name: 'Text Diff Viewer', description: 'Compare two texts and see differences', category: 'developer', icon: 'FileDiff', path: '/tools/text-diff' },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Write and test regular expressions', category: 'developer', icon: 'Search', path: '/tools/regex-tester' },
  { id: 'minify-beautify', name: 'Minify & Beautify', description: 'Clean or compress your code', category: 'developer', icon: 'Zap', path: '/tools/minify-beautify' },
  { id: 'code-playground', name: 'Code Playground', description: 'Live HTML/CSS/JS playground', category: 'developer', icon: 'Layout', path: '/tools/code-playground' },
  
  // Editor Tools
  { id: 'js-editor', name: 'JavaScript Editor', description: 'Edit and format JavaScript code', category: 'editor', icon: 'FileCode', path: '/tools/js-editor' },
  { id: 'ts-editor', name: 'TypeScript Editor', description: 'Edit and format TypeScript code', category: 'editor', icon: 'FileCode', path: '/tools/ts-editor' },
  { id: 'python-editor', name: 'Python Editor', description: 'Edit and format Python scripts', category: 'editor', icon: 'FileCode', path: '/tools/python-editor' },
  { id: 'html-editor', name: 'HTML Editor', description: 'Edit and format HTML markup', category: 'editor', icon: 'Braces', path: '/tools/html-editor' },
  { id: 'css-editor', name: 'CSS Editor', description: 'Edit and format CSS stylesheets', category: 'editor', icon: 'Code2', path: '/tools/css-editor' },
  { id: 'json-editor', name: 'JSON Editor', description: 'Edit and format JSON data', category: 'editor', icon: 'FileJson', path: '/tools/json-editor' },
  { id: 'markdown-editor', name: 'Markdown Editor', description: 'Edit and format Markdown docs', category: 'editor', icon: 'FileText', path: '/tools/markdown-editor' },
  { id: 'yaml-editor', name: 'YAML Editor', description: 'Edit and format YAML config', category: 'editor', icon: 'Settings', path: '/tools/yaml-editor' },
  { id: 'xml-editor', name: 'XML Editor', description: 'Edit and format XML documents', category: 'editor', icon: 'FileCode', path: '/tools/xml-editor' },
  { id: 'sql-editor', name: 'SQL Editor', description: 'Edit and format SQL queries', category: 'editor', icon: 'Database', path: '/tools/sql-editor' },
  { id: 'ini-env-editor', name: 'INI / ENV Editor', description: 'Edit and format config files', category: 'editor', icon: 'Settings', path: '/tools/ini-env-editor' },
  { id: 'csv-editor', name: 'CSV Editor', description: 'Edit CSV data in table view', category: 'editor', icon: 'Table', path: '/tools/csv-editor' },

  // New Tools
  { id: 'ocr-image-to-text', name: 'OCR Image to Text', description: 'Extract text from images locally', category: 'image', icon: 'ScanText', path: '/tools/ocr' },
  { id: 'screenshot-to-pdf', name: 'Screenshot to PDF', description: 'Convert images to PDF documents', category: 'pdf', icon: 'FileImage', path: '/tools/screenshot-to-pdf' },
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Generate QR codes from text or URLs', category: 'creator', icon: 'QrCode', path: '/tools/qr-generator' },
  { id: 'qr-scanner', name: 'QR Code Scanner', description: 'Scan and decode QR codes from images', category: 'creator', icon: 'Scan', path: '/tools/qr-scanner' },
  { id: 'barcode-generator', name: 'Barcode Generator', description: 'Generate barcodes in various formats', category: 'creator', icon: 'Barcode', path: '/tools/barcode-generator' },
  { id: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5 and SHA256 hashes', category: 'developer', icon: 'Hash', path: '/tools/hash-generator' },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate random UUIDs (v4)', category: 'developer', icon: 'Fingerprint', path: '/tools/uuid-generator' },
  { id: 'password-generator', name: 'Password Generator', description: 'Generate secure random passwords', category: 'creator', icon: 'Lock', path: '/tools/password-generator' },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JWT tokens', category: 'developer', icon: 'ShieldCheck', path: '/tools/jwt-decoder' },
  { id: 'jwt-editor', name: 'JWT Editor / Validator', description: 'Edit and validate JWT structures', category: 'developer', icon: 'ShieldAlert', path: '/tools/jwt-editor' },
  { id: 'unix-timestamp', name: 'Unix Timestamp Converter', description: 'Convert between Unix time and dates', category: 'developer', icon: 'Clock', path: '/tools/unix-timestamp' },
  { id: 'cron-parser', name: 'Cron Expression Parser', description: 'Parse and explain cron schedules', category: 'developer', icon: 'CalendarClock', path: '/tools/cron-parser' },
  { id: 'diff-viewer', name: 'Diff / Merge Viewer', description: 'Compare and merge text differences', category: 'developer', icon: 'GitCompare', path: '/tools/diff-viewer' },
  { id: 'api-tester', name: 'API Request Tester', description: 'Test HTTP requests from the browser', category: 'developer', icon: 'Globe', path: '/tools/api-tester' },
  { id: 'curl-to-fetch', name: 'cURL to fetch Converter', description: 'Convert cURL commands to JS fetch', category: 'developer', icon: 'Terminal', path: '/tools/curl-to-fetch' },
  { id: 'sql-formatter-tool', name: 'SQL Formatter', description: 'Beautify and format SQL queries', category: 'developer', icon: 'Database', path: '/tools/sql-formatter' },
  { id: 'json-schema-validator', name: 'JSON Schema Validator', description: 'Validate JSON against a schema', category: 'developer', icon: 'CheckCircle2', path: '/tools/json-schema-validator' },
  { id: 'yaml-json-converter', name: 'YAML / JSON Converter', description: 'Convert between YAML and JSON', category: 'converter', icon: 'ArrowLeftRight', path: '/tools/yaml-json' },
  { id: 'signature-maker', name: 'Signature PNG Maker', description: 'Make signature backgrounds transparent', category: 'image', icon: 'PenTool', path: '/tools/signature-maker' },
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text between different cases', category: 'creator', icon: 'Type', path: '/tools/case-converter' },
  { id: 'slug-generator', name: 'Slug Generator', description: 'Generate URL-friendly slugs', category: 'creator', icon: 'Link2', path: '/tools/slug-generator' },
  { id: 'word-counter', name: 'Word / Character Counter', description: 'Count words, characters, and lines', category: 'creator', icon: 'Hash', path: '/tools/word-counter' },

  // Creator Tools
  { id: 'color-picker', name: 'Color Picker', description: 'Extract colors from images or screen', category: 'creator', icon: 'Pipette', path: '/tools/color-picker' },
  { id: 'favicon-generator', name: 'Favicon Generator', description: 'Create favicons for your website', category: 'creator', icon: 'Globe', path: '/tools/favicon-generator' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text for designs', category: 'creator', icon: 'Type', path: '/tools/lorem-ipsum' },
];

interface AppContextType {
  activeToolId: string | null;
  setActiveToolId: (id: string | null) => void;
  inputData: any;
  setInputData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [inputData, setInputData] = useState<any>(null);

  return (
    <AppContext.Provider value={{ activeToolId, setActiveToolId, inputData, setInputData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
