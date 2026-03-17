import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function HtmlEditor() {
  return (
    <EditorShell
      title="HTML Editor"
      description="Write and edit HTML markup with a live preview and syntax highlighting."
      language="html"
      extension="html"
      initialValue={`<!DOCTYPE html>\n<html>\n<head>\n  <title>ModitQuick</title>\n</head>\n<body>\n  <h1>Welcome to ModitQuick</h1>\n  <p>Your all-in-one tool suite.</p>\n</body>\n</html>`}
      showPreview={true}
      previewComponent={(code) => (
        <iframe
          srcDoc={code}
          title="HTML Preview"
          className="w-full h-full bg-white rounded-2xl"
        />
      )}
    />
  );
}
