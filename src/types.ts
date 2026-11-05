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

export interface EditorCardProps {
  code: string;
  onChange: (nextCode: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isBlurred: boolean;
}

export interface PunchlineOverlayProps {
  status: ReviewStatus;
  message: string | null;
  isSystemError: boolean;
  onDismiss: () => void;
}

export const CRASH_ERROR_CODE = '0x0000F41L';
