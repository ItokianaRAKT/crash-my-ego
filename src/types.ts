/**
 * Shared type definitions for CrashMyEgo.
 * Everything the API can send or receive is declared here so no `any`
 * ever leaks into the components.
 */

/** Payload sent to `POST /api/review`. */
export interface ReviewRequestPayload {
  code: string;
}

/** Successful backend answer: the cynical review text. */
export interface ReviewSuccessResponse {
  review: string;
}

/** Failed backend answer: a machine-readable reason. */
export interface ReviewErrorResponse {
  error: string;
}

/** Discriminated union of everything the endpoint can answer. */
export type ReviewApiResponse = ReviewSuccessResponse | ReviewErrorResponse;

/** Lifecycle of a review request, drives the UI. */
export type ReviewStatus = 'idle' | 'loading' | 'success' | 'error';

/** Reducer-style state held by `App`. */
export interface ReviewState {
  status: ReviewStatus;
  /** Review text shown inside the fatal error popup. */
  reviewResult: string | null;
  /** Set when the request itself failed (network, HTTP, malformed body). */
  errorMessage: string | null;
}

/** Props shared by every window-like component. */
export interface WindowChromeProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Props of `MainWindow`. */
export interface MainWindowProps {
  code: string;
  onChange: (nextCode: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

/** Props of `ErrorPopup`. */
export interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  /**
   * `true` when the popup reports a local/system failure instead of a
   * backend review (changes the title bar and the summary line).
   */
  isSystemError: boolean;
}

/** Props of `Taskbar`. */
export interface TaskbarProps {
  /** Label of the window currently shown as "focused" in the taskbar. */
  activeWindowTitle: string;
  /** Current click volume, between 0 and 1. */
  volume: number;
  /** Called with the new volume when the tray slider is moved. */
  onVolumeChange: (nextVolume: number) => void;
}

/** Props of `TitleBar`. */
export interface TitleBarProps {
  title: string;
  /** `system` = navy gradient, `error` = deep red gradient. */
  variant: 'system' | 'error';
  /**
   * When provided, the ✕ control becomes a real button. When omitted the
   * window controls stay decorative.
   */
  onClose?: () => void;
  /** Hide the minimize / maximize / close controls entirely. */
  showWindowControls?: boolean;
}

/** Fixed-width error code displayed by the crash popup. */
export const CRASH_ERROR_CODE = '0x0000F41L';
