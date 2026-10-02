'use client';

import { useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { EditorView } from '@codemirror/view';

type Props = {
  value: string;
  onChange: (next: string) => void;
  highlight?: boolean;
};

/**
 * Partial CSS is the normal state while a child is typing, so the editor is
 * configured not to throw or mark the document invalid. Highlighting can be
 * switched off per task without removing the library.
 */
export default function CssEditor({ value, onChange, highlight = true }: Props) {
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!viewRef.current) return;
    const current = viewRef.current.state.doc.toString();
    if (current === value) return;
    viewRef.current.dispatch({
      changes: { from: 0, to: current.length, insert: value },
    });
  }, [value]);

  return (
    <div className="rounded-2xl overflow-hidden border-4 border-space-600 bg-space-900">
      <CodeMirror
        value={value}
        height="260px"
        theme="dark"
        extensions={highlight ? [css()] : []}
        onChange={onChange}
        onCreateEditor={(view) => {
          viewRef.current = view;
        }}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          autocompletion: false,
          highlightSelectionMatches: false,
        }}
      />
    </div>
  );
}