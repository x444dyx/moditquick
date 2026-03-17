import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function CssEditor() {
  return (
    <EditorShell
      title="CSS Editor"
      description="Write and edit CSS stylesheets with a clean, syntax-highlighted editor."
      language="css"
      extension="css"
      initialValue={`.modit-quick {\n  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);\n  border-radius: 24px;\n  padding: 2rem;\n  color: white;\n  font-family: 'Inter', sans-serif;\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);\n}`}
      showPreview={true}
      previewComponent={(code) => (
        <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-2xl p-8">
          <style>{code}</style>
          <div className="modit-quick">
            <h3 className="text-xl font-bold mb-2">CSS Preview</h3>
            <p className="opacity-80">This element is styled by the code above.</p>
          </div>
        </div>
      )}
    />
  );
}
