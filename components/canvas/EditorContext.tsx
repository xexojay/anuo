"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Editor } from "tldraw";

interface EditorContextType {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
}

const EditorContext = createContext<EditorContextType>({
  editor: null,
  setEditor: () => {},
});

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [editor, setEditor] = useState<Editor | null>(null);

  const handleSetEditor = useCallback((newEditor: Editor) => {
    setEditor(newEditor);
  }, []);

  return (
    <EditorContext.Provider value={{ editor, setEditor: handleSetEditor }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  return useContext(EditorContext);
}
