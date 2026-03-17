import React from 'react';
import EditorShell from '../../components/EditorShell';
import Markdown from 'react-markdown';

export default function MarkdownEditor() {
  return (
    <EditorShell
      title="Markdown Editor"
      description="Write and edit Markdown documents with a live preview and syntax highlighting."
      language="markdown"
      extension="md"
      initialValue={`# ModitQuick\n\nYour all-in-one tool suite.\n\n## Features\n\n- **Image Tools**: Resize, Compress, Crop, Rotate, Flip\n- **PDF Tools**: Merge, Split, Convert, Rotate, Reorder\n- **Developer Tools**: JSON, Base64, URL, Color, Diff\n\n> "The ultimate tool for developers and creators."`}
      showPreview={true}
      previewComponent={(code) => (
        <div className="w-full h-full overflow-auto bg-white/5 rounded-2xl p-8 prose prose-invert max-w-none">
          <Markdown>{code}</Markdown>
        </div>
      )}
    />
  );
}
