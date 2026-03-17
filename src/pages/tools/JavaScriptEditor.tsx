import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function JavaScriptEditor() {
  return (
    <EditorShell
      title="JavaScript Editor"
      description="Write, edit, and format your JavaScript code with a professional-grade editor."
      language="javascript"
      extension="js"
      initialValue={`// JavaScript Editor\n\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\n\ngreet('ModitQuick');`}
    />
  );
}
