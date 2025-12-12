import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/coach/advice", async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(200).json(getDefaultAdvice(req.body));
    }

    const stats = req.body;
    const prompt = `You are a friendly Japanese language learning coach (Sensei). Based on the student's progress, provide personalized advice in JSON format.

Student's current stats:
- Level: ${stats.level}
- XP: ${stats.xp}
- Current streak: ${stats.streak} days
- Hiragana mastered: ${stats.hiraganaProgress}/46
- Katakana mastered: ${stats.katakanaProgress}/46
- Kanji learned: ${stats.kanjiProgress}/30
- Grammar topics mastered: ${stats.grammarProgress}/9
- Characters struggling with: ${stats.weakCharacters?.length > 0 ? stats.weakCharacters.join(', ') : 'None'}
- Recent quiz accuracy: ${stats.recentAccuracy}%

Respond ONLY with valid JSON in this exact format:
{
  "greeting": "A warm, personalized greeting based on their progress (1 sentence)",
  "analysis": "Brief analysis of their current learning status (2-3 sentences)",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "motivationalQuote": "A short motivational Japanese proverb or saying with English translation"
}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get coach advice');
      }

      const data: GeminiResponse = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return res.json(JSON.parse(jsonMatch[0]));
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Gemini API error:', error);
      return res.json(getDefaultAdvice(stats));
    }
  });

  app.post("/api/coach/explain", async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const { character, type } = req.body;
    
    if (!GEMINI_API_KEY) {
      return res.json({ explanation: 'AI explanation not available. Please configure the Gemini API key.' });
    }

    const prompt = `Explain the Japanese ${type} character "${character}" in a friendly, educational way. Include:
1. Its pronunciation/reading
2. A memorable way to remember it
3. Common words that use it (if applicable)
Keep the response under 100 words.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to explain character');
      }

      const data: GeminiResponse = await response.json();
      const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to explain this character right now.';
      return res.json({ explanation });
    } catch (error) {
      console.error('Gemini API error:', error);
      return res.json({ explanation: 'Unable to explain this character right now. Please try again later.' });
    }
  });

  app.post("/api/coach/chat", async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const { message, context } = req.body;
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.json({ response: "AI is not configured. Please set up the GEMINI_API_KEY environment variable." });
    }

    const prompt = `You are Sensei, a friendly and knowledgeable Japanese language tutor. Your job is to DIRECTLY answer any question the student asks about Japanese.

Student asks: "${message}"

RULES:
1. ALWAYS answer the question directly. Never deflect or redirect.
2. If they ask "what is [word] in Japanese" - immediately give them: the Japanese word in kanji/hiragana, the romaji pronunciation, and a brief explanation.
3. If they ask about grammar - explain it with clear examples using Japanese text and romaji.
4. If they ask about a character - tell them the pronunciation and a memorable way to remember it.
5. Be conversational and helpful. Keep responses 2-4 sentences.
6. Always include Japanese characters with romaji readings.

Examples of good responses:
- Q: "What is car in Japanese?" A: "Car in Japanese is 車 (kuruma). It's written with the kanji 車 which literally means 'vehicle'. You'll hear this word a lot in everyday Japanese!"
- Q: "How do I say hello?" A: "Hello in Japanese is こんにちは (konnichiwa). It's used during daytime. In the morning, use おはようございます (ohayou gozaimasu), and in the evening, use こんばんは (konbanwa)."

Now answer the student's question:`;

    try {
      console.log('Calling Gemini API for chat with message:', message);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', response.status, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('Gemini response:', JSON.stringify(data, null, 2));
      
      const chatResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!chatResponse) {
        console.error('No text in Gemini response:', data);
        throw new Error('Empty response from Gemini');
      }
      
      return res.json({ response: chatResponse });
    } catch (error) {
      console.error('Gemini Chat API error:', error);
      return res.json({ response: "Sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment!" });
    }
  });

  return httpServer;
}

function getDefaultAdvice(stats: {
  level?: number;
  streak?: number;
  hiraganaProgress?: number;
  katakanaProgress?: number;
  weakCharacters?: string[];
}) {
  const recommendations: string[] = [];
  const level = stats.level || 1;
  const streak = stats.streak || 0;
  const hiraganaProgress = stats.hiraganaProgress || 0;
  const katakanaProgress = stats.katakanaProgress || 0;
  const weakCharacters = stats.weakCharacters || [];

  if (hiraganaProgress < 46) {
    recommendations.push('Continue practicing Hiragana - you\'re making great progress!');
  }
  if (katakanaProgress < 20) {
    recommendations.push('Start learning Katakana to expand your reading ability.');
  }
  if (weakCharacters.length > 0) {
    recommendations.push(`Focus on your weak characters: ${weakCharacters.slice(0, 5).join(', ')}`);
  }
  if (recommendations.length < 3) {
    recommendations.push('Complete the Daily Challenge for bonus XP!');
  }

  return {
    greeting: streak >= 3 
      ? `Great job maintaining your ${streak} day streak!` 
      : 'Welcome back to your Japanese learning journey!',
    analysis: `You're at Level ${level} with ${hiraganaProgress}/46 Hiragana and ${katakanaProgress}/46 Katakana mastered. ${weakCharacters.length > 0 ? 'Some characters need extra practice.' : 'Keep up the excellent work!'}`,
    recommendations: recommendations.slice(0, 3),
    motivationalQuote: '七転び八起き (Nana korobi ya oki) - Fall seven times, stand up eight.',
  };
}
