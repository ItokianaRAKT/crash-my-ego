import { useCallback, useEffect, useState } from 'react';
import {
  isApiErrorMessage,
  readReviewMessage,
  requestCodeReview,
} from './api/reviewApi';
import { setClickVolume } from './audio/mouseClick';
import { ErrorPopup } from './components/ErrorPopup';
import { MainWindow } from './components/MainWindow';
import { Taskbar } from './components/Taskbar';
import type { ReviewStatus } from './types';

const APPLICATION_TITLE = 'CrashMyEgo - Revue de code.exe';

const DEFAULT_CLICK_VOLUME = 0.7;

export default function App(): JSX.Element {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSystemError, setIsSystemError] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(DEFAULT_CLICK_VOLUME);

  const isLoading = status === 'loading';

  useEffect(() => {
    setClickVolume(volume);
  }, [volume]);

  const handleVolumeChange = useCallback((nextVolume: number): void => {
    setVolume(nextVolume);
  }, []);

  const handleCodeChange = useCallback((nextCode: string): void => {
    setCode(nextCode);
  }, []);

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

      <Taskbar
        activeWindowTitle={APPLICATION_TITLE}
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}
