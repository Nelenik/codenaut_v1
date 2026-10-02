'use client';

import { useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { EditorView } from '@codemirror/view';

/**
 * The audience reads at 7 and types with a keyboard aimed at a screen, so the
 * editor is set noticeably larger than a developer default.
 */
const largeFontTheme = EditorView.theme({
  '&': { fontSize: '1.35rem' },
  '.cm-content': {
    fontSize: '1.35rem',
    lineHeight: '1.7',
    padding: '1rem',
  },
  '.cm-scroller': { fontFamily: 'var(--font-mono)', overflow: 'auto' },
  '.cm-gutters': { display: 'none' },
});

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
    <div className="flex-1 flex flex-col rounded-2xl overflow-hidden border-4 border-space-600 bg-space-900 min-h-[260px]">
      <CodeMirror
        value={value}
        height="100%"
        theme="dark"
        extensions={highlight ? [css(), largeFontTheme] : [largeFontTheme]}
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