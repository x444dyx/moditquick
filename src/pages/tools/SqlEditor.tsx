import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function SqlEditor() {
  return (
    <EditorShell
      title="SQL Editor"
      description="Write and edit SQL queries with a clean, syntax-highlighted editor."
      language="sql"
      extension="sql"
      initialValue={`-- SQL Editor\n\nSELECT \n  u.id, \n  u.name, \n  p.title \nFROM users u\nJOIN posts p ON u.id = p.user_id\nWHERE u.status = 'active'\nORDER BY p.created_at DESC;`}
    />
  );
}
