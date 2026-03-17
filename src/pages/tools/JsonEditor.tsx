import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function JsonEditor() {
  return (
    <EditorShell
      title="JSON Editor"
      description="Edit, format, and validate your JSON data with a professional editor."
      language="json"
      extension="json"
      initialValue={`{\n  "name": "ModitQuick",\n  "version": "1.0.0",\n  "description": "All-in-one tool suite",\n  "features": [\n    "Image Tools",\n    "PDF Tools",\n    "Developer Tools"\n  ]\n}`}
    />
  );
}
