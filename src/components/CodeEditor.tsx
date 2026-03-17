import React, { memo } from 'react';
import Editor, { OnMount, loader } from '@monaco-editor/react';

// Pre-configure monaco loader
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  }
});

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  height?: string | number;
  readOnly?: boolean;
  onMount?: OnMount;
}

const CodeEditor = memo(({ 
  value, 
  onChange, 
  language, 
  height = '100%', 
  readOnly = false,
  onMount
}: CodeEditorProps) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Custom theme - Define only once if possible
    if (!monaco.editor.getModels().some(m => m.getLanguageId() === 'modit-dark')) {
      monaco.editor.defineTheme('modit-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1e1e1e', // Solid background is much faster than transparent with blur
          'editor.lineHighlightBackground': '#ffffff05',
          'editorCursor.foreground': '#6366f1',
          'editor.selectionBackground': '#6366f133',
          'editorIndentGuide.background': '#ffffff10',
          'editorIndentGuide.activeBackground': '#ffffff20',
        }
      });
    }
    monaco.editor.setTheme('modit-dark');

    if (onMount) {
      onMount(editor, monaco);
    }
  };

  return (
    <div className="w-full h-full relative group bg-[#1e1e1e]">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          readOnly: readOnly,
          automaticLayout: true,
          padding: { top: 20, bottom: 20 },
          cursorSmoothCaretAnimation: 'on',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          contextmenu: true,
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .monaco-editor .scroll-decoration {
          box-shadow: none !important;
        }
        .monaco-editor .margin {
          background-color: #1e1e1e !important;
        }
      `}} />
    </div>
  );
});

export default CodeEditor;
