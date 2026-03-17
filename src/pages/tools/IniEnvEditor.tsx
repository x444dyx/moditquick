import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function IniEnvEditor() {
  return (
    <EditorShell
      title="INI / ENV Editor"
      description="Edit and format your .ini and .env configuration files with a clean editor."
      language="ini"
      extension="env"
      initialValue={`# .env Editor\n\nAPP_NAME=ModitQuick\nAPP_VERSION=1.0.0\nAPP_ENV=production\n\n# Database Settings\nDB_HOST=localhost\nDB_PORT=5432\nDB_USER=modit\nDB_PASS=quick`}
    />
  );
}
