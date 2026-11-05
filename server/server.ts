import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import Groq from 'groq-sdk';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);
const FRONTEND_ORIGIN = 'http://localhost:5173';
const GROQ_MODEL = process.env.GROQ_MODEL ?? 'qwen/qwen3.8-27b';

const SYSTEM_PROMPT =
  'Tu es un ingénieur senior ultra-cynique, clinique, froid et méprisant. Analyse le code fourni et donne une seule remarque courte (maximum 2 phrases), extrêmement cinglante et piquante sur pourquoi ce code est médiocre. Ne sois pas constructif. Ne donne aucune solution. Sois juste cassant, froid et supérieur.';

if (!process.env.GROQ_API_KEY) {
  console.error(
    'GROQ_API_KEY manquant : copiez .env.example vers .env et renseignez votre clé Groq.',
  );
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyse ce code :\n\n${code}` },
        ],
      });

      const review = completion.choices[0]?.message?.content?.trim();

      if (!review) {
        res.status(500).json({
          error: 'Le reviewer est resté muet : même le mépris l\'a abandonné.',
        });
        return;
      }

      res.status(200).json({ review });
    } catch (error: unknown) {
      const reason = error instanceof Error ? error.message : 'erreur inconnue';
      console.error(`[groq] échec de la revue : ${reason}`);

      res.status(500).json({
        error: 'Le reviewer a planté en analysant votre code. Prenez ça comme un avis.',
      });
    }
  },
);

app.listen(PORT, () => {
  console.log(`API CrashMyEgo à l’écoute sur http://localhost:${PORT}`);
});
