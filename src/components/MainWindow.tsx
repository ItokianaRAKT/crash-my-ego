import { useCallback, type ChangeEvent, type KeyboardEvent } from 'react';
import type { MainWindowProps } from '../types';
import { TitleBar } from './TitleBar';

/** Menu entries rendered statically, like a real Win95 application. */
const MENU_ENTRIES: readonly string[] = ['Fichier', 'Édition', 'Affichage', 'Aide'];

/**
 * The editor window: a title bar, a static menu strip, a toolbar with the
 * submit action, the sunken code textarea and a status bar.
 */
export function MainWindow({
  code,
  onChange,
  onSubmit,
  isLoading,
}: MainWindowProps): JSX.Element {
  const handleTextareaChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>): void => {
      onChange(event.target.value);
    },
    [onChange],
  );

  // Ctrl + Enter sends the code, exactly like the toolbar button does.
  const handleTextareaKeyDown = useCallback(
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
  }, [onChange]);

  const handleSubmit = useCallback((): void => {
    onSubmit();
  }, [onSubmit]);

  const isSubmitDisabled = isLoading || code.trim().length === 0;
  const lineCount = code.length === 0 ? 1 : code.split('\n').length;
  const statusLabel = isLoading
    ? 'Analyse en cours…'
    : `Ln ${lineCount}, Col 1 — ${code.length} car.`;

  return (
    <section
      aria-label="Fenêtre de saisie de code"
      className="win95-raised flex h-full w-full flex-col bg-[#c0c0c0] p-[3px]"
    >
      <TitleBar title="CrashMyEgo - Revue de code.exe" variant="system" />

      {/* Static menu strip */}
      <nav
        aria-label="Menu principal"
        className="mt-[2px] flex gap-[10px] px-[4px] pb-[2px] text-[11px] select-none"
      >
        {MENU_ENTRIES.map((entry) => (
          <span key={entry} className="cursor-default px-[3px] hover:bg-[#000080] hover:text-white">
            <u>{entry.charAt(0)}</u>
            {entry.slice(1)}
          </span>
        ))}
      </nav>

      {/* Toolbar */}
      <div className="win95-sunken-thin mt-[2px] flex flex-wrap items-center gap-2 bg-[#c0c0c0] px-2 py-[5px]">
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading || code.length === 0}
          className="win95-button flex items-center gap-1"
        >
          <span aria-hidden="true">🧹</span>
          Effacer
        </button>

        <span className="ml-auto hidden text-[11px] text-[#404040] sm:inline">
          Ctrl + Entrée
        </span>
      </div>

      {/* Editor */}
      <div className="relative mt-[3px] flex min-h-0 flex-1 flex-col">
        <textarea
          value={code}
          onChange={handleTextareaChange}
          onKeyDown={handleTextareaKeyDown}
          spellCheck={false}
          disabled={isLoading}
          aria-label="Saisie du code à reviewer"
          placeholder="// Collez ici le code que vous assumez."
          className="win95-sunken h-full min-h-[220px] w-full flex-1 resize-none bg-white p-[6px] font-mono text-[13px] leading-[18px] text-black shadow-[inset_2px_2px_0px_#000] placeholder:text-[#808080] disabled:bg-[#dfdfdf] disabled:text-[#808080]"
        />
      </div>

      {/* Status bar — the primary action lives at the bottom right */}
      <div className="mt-[3px] flex items-center gap-2 text-[11px]">
        <p className="win95-sunken-thin min-w-0 flex-1 truncate px-[4px] py-[1px]">
          {statusLabel}
        </p>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="win95-button flex shrink-0 items-center gap-1 font-bold"
        >
          <span aria-hidden="true">{isLoading ? '⏳' : '💀'}</span>
          {isLoading ? 'Calcul du mépris...' : 'Soumettre au mépris'}
        </button>
      </div>
    </section>
  );
}
