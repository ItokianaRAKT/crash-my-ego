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
import { CodeIcon, SparkleIcon } from './icons/ModernIcons';

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
    <section className="card flex min-h-[560px] min-w-0 flex-col overflow-hidden">
      <header className="card-header flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70 text-indigo-400">
            <CodeIcon className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">Editor</h2>
            <p className="truncate text-xs text-zinc-500">
              Paste the code you are proud of
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading || code.length === 0}
          className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 shrink-0 overflow-hidden border-r border-zinc-800 bg-surface-muted px-3 py-4 text-right font-mono text-[13px] leading-6 text-zinc-600 select-none"
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
          aria-label="Code à reviewer"
          placeholder={'// Paste the code you are proud of…\nfunction add(a, b) {\n  return a + b;\n}'}
          className="min-h-[420px] w-full flex-1 resize-none overflow-auto bg-transparent px-4 py-4 font-mono text-[13px] leading-6 text-zinc-200 caret-indigo-400 outline-none placeholder:text-zinc-600"
        />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-surface-muted/60 px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-500">
          <span>
            Ln {cursor.line}, Col {cursor.column}
          </span>
          <span>{lineNumbers.length} lines</span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px]">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px]">
              Enter
            </kbd>
          </span>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="gradient-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
        >
          {isLoading ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            <SparkleIcon className="h-4 w-4" />
          )}
          {isLoading ? 'Calcul du mépris...' : 'Review Code'}
        </button>
      </footer>
    </section>
  );
}
