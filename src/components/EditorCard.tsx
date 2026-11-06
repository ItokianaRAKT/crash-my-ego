import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type SyntheticEvent,
} from 'react';
import type { EditorCardProps } from '../types';
import { CodeIcon } from './icons/ModernIcons';

interface CursorPosition {
  line: number;
  column: number;
}

function readCursorPosition(value: string, selectionStart: number): CursorPosition {
  const textBeforeCursor = value.slice(0, selectionStart);
  const lines = textBeforeCursor.split('\n');
  const currentLine = lines[lines.length - 1] ?? '';

  return {
    line: lines.length,
    column: currentLine.length + 1,
  };
}

export function EditorCard({
  code,
  onChange,
  onSubmit,
  isLoading,
  isBlurred,
}: EditorCardProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState<CursorPosition>({ line: 1, column: 1 });

  const lineNumbers = useMemo<number[]>(() => {
    const totalLines = Math.max(code.split('\n').length, 1);
    return Array.from({ length: totalLines }, (_, index) => index + 1);
  }, [code]);

  const isSubmitDisabled = isLoading || code.trim().length === 0;

  const handleScroll = useCallback((): void => {
    const textarea = textareaRef.current;
    const gutter = gutterRef.current;

    if (textarea !== null && gutter !== null) {
      gutter.scrollTop = textarea.scrollTop;
    }
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>): void => {
      const { value, selectionStart } = event.currentTarget;
      onChange(value);
      setCursor(readCursorPosition(value, selectionStart));
    },
    [onChange],
  );

  const handleSelectionChange = useCallback(
    (event: SyntheticEvent<HTMLTextAreaElement>): void => {
      const { value, selectionStart } = event.currentTarget;
      setCursor(readCursorPosition(value, selectionStart));
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>): void => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onSubmit();
      }
    },
    [onSubmit],
  );

  const handleClear = useCallback((): void => {
    onChange('');
    setCursor({ line: 1, column: 1 });
    textareaRef.current?.focus();
  }, [onChange]);

  return (
    <section
      aria-hidden={isBlurred}
      className={`flex h-full min-w-0 flex-col rounded-md border border-zinc-900 bg-[#0c0c0c] transition duration-300 ${
        isBlurred ? 'pointer-events-none scale-[1.01]' : ''
      }`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-zinc-900 px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <CodeIcon className="h-4 w-4 shrink-0 text-white" />
          <h2 className="shrink-0 text-[11px] font-medium tracking-[0.22em] text-white uppercase">
            Éditeur
          </h2>
        </div>

        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading || code.length === 0}
          className="shrink-0 text-[11px] tracking-[0.16em] text-zinc-500 uppercase transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          Effacer
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 shrink-0 overflow-hidden border-r border-zinc-900 px-3 py-4 text-right font-mono text-[13px] leading-6 text-zinc-700 select-none"
        >
          {lineNumbers.map((lineNumber) => (
            <div key={lineNumber}>{lineNumber}</div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onScroll={handleScroll}
          onSelect={handleSelectionChange}
          onKeyDown={handleKeyDown}
          wrap="off"
          spellCheck={false}
          aria-label="Zone de code à relire"
          placeholder={'// Collez ici le code que vous assumez…\nfunction add(a, b) {\n  return a + b;\n}'}
          className="min-h-0 w-full flex-1 resize-none overflow-auto bg-transparent px-5 py-4 font-mono text-[13px] leading-6 text-white caret-white outline-none placeholder:text-zinc-600"
        />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-900 px-5 py-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-500">
          <span>
            Lig {cursor.line}, Col {cursor.column}
          </span>
          <span>
            {lineNumbers.length} ligne{lineNumbers.length > 1 ? 's' : ''}
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <kbd className="rounded border border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="rounded border border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
              Enter
            </kbd>
          </span>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2 text-[13px] font-semibold text-black transition hover:bg-zinc-200 active:translate-y-px disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          {isLoading ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
          ) : null}
          {isLoading ? 'Calcul du mépris...' : 'Lancer la revue'}
        </button>
      </footer>
    </section>
  );
}
