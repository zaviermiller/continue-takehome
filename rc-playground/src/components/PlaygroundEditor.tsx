import Editor, { OnMount } from '@monaco-editor/react';
import { useEffect, useState } from 'react';

const fetchTypeDefinitions = async (): Promise<string> => {
  const url =
    'https://cdn.jsdelivr.net/npm/@resaleai/receipt-components@4.0.0/dist/main.d.ts';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch type definitions from ${url}`);
  }
  const text = await response.text();

  // hack to get rid of export statement (not supported by monaco)
  return text.split('export')[0];
};

interface PlaygroundEditorProps {
  code: string;
  onChange: (code: string) => void;
}

const PlaygroundEditor = ({ code, onChange }: PlaygroundEditorProps) => {
  const [typeDefinitions, setTypeDefinitions] = useState<string | null>(null);

  useEffect(() => {
    const loadTypeDefinitions = async () => {
      try {
        const definitions = await fetchTypeDefinitions();
        setTypeDefinitions(definitions);
      } catch (err) {
        console.error(err);
      }
    };

    loadTypeDefinitions();
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    if (typeDefinitions) {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        typeDefinitions,
        '@resaleai/receipt-components'
      );
    }
  };

  return (
    <>
      {typeDefinitions && (
        <Editor
          height="100%"
          language="typescript"
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
        />
      )}
    </>
  );
};

export default PlaygroundEditor;
