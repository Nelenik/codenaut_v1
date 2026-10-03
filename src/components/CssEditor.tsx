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
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!viewRef.current) return;
    const current = viewRef.current.state.doc.toString();
    if (current === value) return;
    viewRef.current.dispatch({
      changes: { from: 0, to: current.length, insert: value },
    });
  }, [value]);

  /**
   * A property dragged in from the basket lands as `property: ` at the spot the
   * child dropped it on, with a line break when it follows something else, so
   * the second property never gets typed onto the end of the first.
   *
   * CodeMirror 6 registers no `dragover` handler of its own, so without
   * `preventDefault` the browser never allows a drop here at all. It does
   * handle `drop` on the content element, which is why this listener is
   * registered in the capture phase and stops propagation: the drop has to be
   * handled exactly once, and the insert shape is decided here.
   */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onDragOver = (event: DragEvent) => {
      if (!event.dataTransfer) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    };

    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const view = viewRef.current;
      const property = event.dataTransfer?.getData('text/plain')?.trim() ?? '';
      if (!view || !property) return;

      const at = view.posAtCoords({ x: event.clientX, y: event.clientY }) ?? view.state.doc.length;
      const insert =
        at > 0 && view.state.doc.sliceString(at - 1, at) !== '\n' ? `\n${property}: ` : `${property}: `;

      view.dispatch({
        changes: { from: at, insert },
        selection: { anchor: at + insert.length },
      });
      view.focus();
    };

    el.addEventListener('dragover', onDragOver);
    el.addEventListener('drop', onDrop, true);
    return () => {
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('drop', onDrop, true);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="flex-1 flex flex-col rounded-2xl overflow-hidden border-4 border-space-600 bg-space-900 min-h-65"
    >
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