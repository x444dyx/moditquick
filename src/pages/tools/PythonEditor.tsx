import React from 'react';
import EditorShell from '../../components/EditorShell';

export default function PythonEditor() {
  return (
    <EditorShell
      title="Python Editor"
      description="Write and edit Python scripts with a clean, syntax-highlighted editor."
      language="python"
      extension="py"
      initialValue={`# Python Editor\n\ndef greet(name):\n    print(f"Hello, {name}!")\n\nif __name__ == "__main__":\n    greet("ModitQuick")`}
    />
  );
}
