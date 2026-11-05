import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import Groq from 'groq-sdk';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);
const FRONTEND_ORIGIN = 'http://localhost:5173';
const DEFAULT_MODELS: readonly string[] = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'allam-2-7b',
];

function resolveModels(): string[] {
  const raw = process.env.GROQ_MODELS ?? process.env.GROQ_MODEL;
  const configured = (raw ?? '')
    .split(',')
    .map((model) => model.trim())
    .filter((model) => model.length > 0);

  return configured.length > 0 ? configured : [...DEFAULT_MODELS];
}

const GROQ_MODELS = resolveModels();

const SYSTEM_PROMPT =
  "Tu es un ingénieur senior ultra-cynique, clinique, froid et méprisant. Analyse le code fourni et donne une seule remarque courte (maximum 2 phrases), extrêmement cinglante et piquante sur pourquoi ce code est médiocre. Ne sois pas constructif. Ne donne aucune solution. Sois juste cassant, froid et supérieur. Si le code est propre ou si tu n'a rien a dire, trouve quand meme une remarque cinglante a faire sur le manque d'originalité ou de personnalité par exemple. Ne fais jamais de compliment";

if (!process.env.GROQ_API_KEY) {
  console.error(
    'GROQ_API_KEY manquant : copiez .env.example vers .env et renseignez votre clé Groq.',
  );
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let preferredModelIndex = 0;

interface ErrorWithStatus {
  status?: unknown;
}

function readHttpStatus(error: unknown): number | null {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const { status } = error as ErrorWithStatus;
    if (typeof status === 'number') {
      return status;
    }
  }

  return null;
}

function isAuthFailure(error: unknown): boolean {
  const status = readHttpStatus(error);
  return status === 401 || status === 403;
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'erreur inconnue';
}

async function requestReview(code: string): Promise<string> {
  let lastError: unknown = new Error('aucun modèle disponible');

  for (let attempt = 0; attempt < GROQ_MODELS.length; attempt += 1) {
    const index = (preferredModelIndex + attempt) % GROQ_MODELS.length;
    const model = GROQ_MODELS[index];

    if (model === undefined) {
      continue;
    }

    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyse ce code :\n\n${code}` },
        ],
      });

      const review = completion.choices[0]?.message?.content?.trim();

      if (review) {
        preferredModelIndex = index;
        console.log(`[groq] revue générée par ${model}`);
        return review;
      }

      lastError = new Error(`réponse vide de ${model}`);
      console.warn(`[groq] ${model} a répondu vide, modèle suivant…`);
    } catch (error: unknown) {
      lastError = error;
      console.warn(`[groq] ${model} indisponible : ${describeError(error)}`);

      if (isAuthFailure(error)) {
        break;
      }
    }
  }

  throw lastError;
}

interface ReviewRequestBody {
  code?: unknown;
}

const app = express();

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: '100kb' }));

app.post(
  '/api/review',
  async (req: Request<unknown, unknown, ReviewRequestBody>, res: Response): Promise<void> => {
    const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';

    if (code.length === 0) {
      res.status(400).json({
        error: 'Le reviewer refuse de lire du vide : envoyez un champ « code » non vide.',
      });
      return;
    }

    try {
      const review = await requestReview(code);
      res.status(200).json({ review });
    } catch (error: unknown) {
      console.error(`[groq] échec de la revue : ${describeError(error)}`);

      res.status(500).json({
        error: 'Le reviewer a planté en analysant votre code. Prenez ça comme un avis.',
      });
    }
  },
);

app.listen(PORT, () => {
  console.log(`API CrashMyEgo à l’écoute sur http://localhost:${PORT}`);
});
