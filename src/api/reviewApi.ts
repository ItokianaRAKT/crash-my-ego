import type {
  ReviewApiResponse,
  ReviewErrorResponse,
  ReviewRequestPayload,
  ReviewSuccessResponse,
} from '../types';

/** Endpoint expected by the backend. */
const REVIEW_ENDPOINT = '/api/review';

/** Delay applied by the local fallback so the loading state is visible. */
const LOCAL_REVIEW_DELAY_MS = 1400;

/** Cynical reviews used when no backend is reachable. */
const LOCAL_REVIEWS: readonly string[] = [
  "Ce code n'est pas du code, c'est un aveu écrit.",
  'Votre variable `temp2` a plus de responsabilités que la moitié de vos collègues.',
  'J\u2019ai vu des choses plus propres dans un cendrier de salle de pause.',
  'Ce try/catch ne protège rien : il affiche juste votre peur au grand jour.',
  'Votre code a passé la revue. Le verdict : rejeté avec mépris.',
  'Aucune documentation, aucun test, aucun espoir. On continue quand même.',
  'Ce nom de fonction décrit exactement ce qu\u2019il fait. Malheureusement.',
];

/** Narrow a JSON body to the expected success shape. */
function isSuccessResponse(body: unknown): body is ReviewSuccessResponse {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  const candidate = body as Record<string, unknown>;
  return typeof candidate.review === 'string';
}

/** Narrow a JSON body to the expected error shape. */
function isErrorResponse(body: unknown): body is ReviewErrorResponse {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  const candidate = body as Record<string, unknown>;
  return typeof candidate.error === 'string';
}

/**
 * Pick a local review deterministically so the same code always receives
 * the same insult during a session.
 */
function buildLocalReview(code: string): string {
  const seed = code.length + code.split('\n').length;
  const review = LOCAL_REVIEWS[seed % LOCAL_REVIEWS.length];
  return review ?? 'Votre code a été refusé sans commentaire.';
}

/** Wait before answering, to mimic a real backend round-trip. */
function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

/**
 * Send the code to the backend for a passive-aggressive review.
 *
 * When the endpoint is unreachable (no backend running, CORS, 404, invalid
 * JSON…) the function degrades gracefully and answers with a locally
 * generated review instead of throwing, so the popup always has content.
 */
export async function requestCodeReview(
  payload: ReviewRequestPayload,
): Promise<ReviewApiResponse> {
  try {
    const response = await fetch(REVIEW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Unexpected HTTP status: ${response.status}`);
    }

    const body: unknown = await response.json();

    if (isSuccessResponse(body) || isErrorResponse(body)) {
      return body;
    }

    throw new Error('Malformed response body');
  } catch {
    // No backend available — answer locally so the UI stays usable.
    await wait(LOCAL_REVIEW_DELAY_MS);
    return { review: buildLocalReview(payload.code) };
  }
}

/** Extract the human-readable message from any API answer. */
export function readReviewMessage(response: ReviewApiResponse): string {
  if ('review' in response) {
    return response.review;
  }
  return response.error;
}

/** `true` when the answer carries a machine error instead of a review. */
export function isApiErrorMessage(response: ReviewApiResponse): boolean {
  return 'error' in response;
}
