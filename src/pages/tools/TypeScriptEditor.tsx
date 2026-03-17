import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function TypeScriptEditor() {
  return (
    <EditorShell
      title="TypeScript Editor"
      description="Edit and format your TypeScript code with full syntax highlighting and type support."
      language="typescript"
      extension="ts"
      initialValue={`// TypeScript Editor\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst user: User = {\n  id: 1,\n  name: 'ModitQuick',\n  email: 'hello@modit.quick'\n};`}
    />
  );
}
