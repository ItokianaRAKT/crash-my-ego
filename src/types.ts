export interface ReviewRequestPayload {
  code: string;
}

export interface ReviewSuccessResponse {
  review: string;
}

export interface ReviewErrorResponse {
  error: string;
}

export type ReviewApiResponse = ReviewSuccessResponse | ReviewErrorResponse;

export type ReviewStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ReviewState {
  status: ReviewStatus;
  reviewResult: string | null;
  errorMessage: string | null;
}

export interface WindowChromeProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MainWindowProps {
  code: string;
  onChange: (nextCode: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isSystemError: boolean;
}

export interface TaskbarProps {
  activeWindowTitle: string;
  volume: number;
  onVolumeChange: (nextVolume: number) => void;
}

export interface TitleBarProps {
  title: string;
  variant: 'system' | 'error';
  onClose?: () => void;
  showWindowControls?: boolean;
}

export interface EditorCardProps {
  code: string;
  onChange: (nextCode: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export interface InsightsCardProps {
  status: ReviewStatus;
  message: string | null;
  isSystemError: boolean;
}

export const CRASH_ERROR_CODE = '0x0000F41L';
