import type {
  ReviewApiResponse,
  ReviewErrorResponse,
  ReviewRequestPayload,
  ReviewSuccessResponse,
} from '../types';

const REVIEW_ENDPOINT = '/api/review';

const LOCAL_REVIEW_DELAY_MS = 1400;

const LOCAL_REVIEWS: readonly string[] = [
  'Ce code existe. C’est déjà une décision discutable.',
  'Rien à signaler, si ce n’est une ambition générale très en dessous de vos prétentions.',
  'Ni bon ni mauvais : indifférent. C’est le pire des verdicts.',
  'Tout est là, rien ne brille. Un excellent résumé de votre carrière.',
  'Votre code ne dérange personne. Peut-être est-ce exactement le problème.',
  'On pourrait l’améliorer, mais aucun endroit n’offre de prise sans blesser qui que ce soit.',
  'Syntaxe correcte, âme absente. Le classique intemporel.',
  'Ce code respire la fiabilité, et surtout l’ennui mortel.',
];

function isSuccessResponse(body: unknown): body is ReviewSuccessResponse {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  const candidate = body as Record<string, unknown>;
  return typeof candidate.review === 'string';
}

function isErrorResponse(body: unknown): body is ReviewErrorResponse {
  if (typeof body !== 'object' || body === null) {
    return false;
  }
  const candidate = body as Record<string, unknown>;
  return typeof candidate.error === 'string';
}

function buildLocalReview(code: string): string {
  const seed = code.length + code.split('\n').length;
  const review = LOCAL_REVIEWS[seed % LOCAL_REVIEWS.length];
  return review ?? 'Votre code a été refusé sans commentaire.';
}

function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

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
    await wait(LOCAL_REVIEW_DELAY_MS);
    return { review: buildLocalReview(payload.code) };
  }
}

export function readReviewMessage(response: ReviewApiResponse): string {
  if ('review' in response) {
    return response.review;
  }
  return response.error;
}

export function isApiErrorMessage(response: ReviewApiResponse): boolean {
  return 'error' in response;
}
