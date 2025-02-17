// pages/api/translate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    translation?: string;
    error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { text } = req.body;
    if (!text) {
        res.status(400).json({ error: 'Missing text' });
        return;
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'Google Translate API key not configured' });
        return;
    }

    try {
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: text,
                    target: 'ja',
                }),
            }
        );
        const data = await response.json();
        if (data.error) {
            res.status(500).json({ error: data.error.message });
        } else {
            const translation = data.data.translations[0].translatedText;
            res.status(200).json({ translation });
        }
    } catch (error: unknown) {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(500).json({ error: errorMessage });
    }
}