import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function YamlEditor() {
  return (
    <EditorShell
      title="YAML Editor"
      description="Edit and format your YAML configuration files with a clean, syntax-highlighted editor."
      language="yaml"
      extension="yaml"
      initialValue={`name: ModitQuick\nversion: 1.0.0\ndescription: All-in-one tool suite\nfeatures:\n  - Image Tools\n  - PDF Tools\n  - Developer Tools\nsettings:\n  theme: dark\n  notifications: true`}
    />
  );
}
