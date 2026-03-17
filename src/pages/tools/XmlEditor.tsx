import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function XmlEditor() {
  return (
    <EditorShell
      title="XML Editor"
      description="Edit and format your XML documents with a clean, syntax-highlighted editor."
      language="xml"
      extension="xml"
      initialValue={`<?xml version="1.0" encoding="UTF-8"?>\n<modit-quick>\n  <name>ModitQuick</name>\n  <version>1.0.0</version>\n  <description>All-in-one tool suite</description>\n  <features>\n    <feature>Image Tools</feature>\n    <feature>PDF Tools</feature>\n    <feature>Developer Tools</feature>\n  </features>\n</modit-quick>`}
    />
  );
}
