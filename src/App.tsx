import { useCallback, useState } from 'react';
import {
  isApiErrorMessage,
  readReviewMessage,
  requestCodeReview,
} from './api/reviewApi';
import { ErrorPopup } from './components/ErrorPopup';
import { MainWindow } from './components/MainWindow';
import { Taskbar } from './components/Taskbar';
import type { ReviewStatus } from './types';

/** Title shown in the taskbar and used by the desktop shell. */
const APPLICATION_TITLE = 'CrashMyEgo - Revue de code.exe';

/**
 * Application shell: owns every piece of global state and the asynchronous
 * review submission flow, then renders the desktop, the editor window, the
 * fatal error popup and the taskbar.
 */
export default function App(): JSX.Element {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSystemError, setIsSystemError] = useState<boolean>(false);

  const isLoading = status === 'loading';

  const handleCodeChange = useCallback((nextCode: string): void => {
    setCode(nextCode);
  }, []);

  /**
   * Send the current code to the reviewer and open the crash popup with the
   * answer. Loading is reflected immediately through the button label.
   */
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (code.trim().length === 0 || status === 'loading') {
      return;
    }

    setStatus('loading');

    try {
      const response = await requestCodeReview({ code });
      const failedRequest = isApiErrorMessage(response);

      setReviewResult(readReviewMessage(response));
      setIsSystemError(failedRequest);
      setStatus(failedRequest ? 'error' : 'success');
      setIsModalOpen(true);
    } catch (error: unknown) {
      // Belt and braces: the API client degrades on its own, but a rejected
      // promise must still surface as a system error instead of a silent UI.
      const fallbackMessage =
        error instanceof Error ? error.message : 'Erreur inconnue du reviewer.';

      setReviewResult(fallbackMessage);
      setIsSystemError(true);
      setStatus('error');
      setIsModalOpen(true);
    }
  }, [code, status]);

  const handleClosePopup = useCallback((): void => {
    setIsModalOpen(false);
    setStatus('idle');
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#008080]">
      {/* Only the application window is shown: it fills the viewport above
          the taskbar, no desktop wallpaper or shortcuts behind it. */}
      <main className="relative z-10 flex min-h-0 flex-1 flex-col pb-[30px]">
        <MainWindow
          code={code}
          onChange={handleCodeChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>

      <ErrorPopup
        isOpen={isModalOpen}
        onClose={handleClosePopup}
        message={reviewResult ?? 'Aucune revue reçue.'}
        isSystemError={isSystemError}
      />

      <Taskbar activeWindowTitle={APPLICATION_TITLE} />
    </div>
  );
}
