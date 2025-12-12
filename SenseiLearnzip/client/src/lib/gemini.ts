export interface CoachAdvice {
  greeting: string;
  analysis: string;
  recommendations: string[];
  motivationalQuote: string;
}

export async function getCoachAdvice(stats: {
  level: number;
  xp: number;
  streak: number;
  hiraganaProgress: number;
  katakanaProgress: number;
  kanjiProgress: number;
  grammarProgress: number;
  weakCharacters: string[];
  recentAccuracy: number;
}): Promise<CoachAdvice> {
  try {
    const response = await fetch('/api/coach/advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });

    if (!response.ok) {
      throw new Error('Failed to get coach advice');
    }

    return await response.json();
  } catch (error) {
    console.error('Coach API error:', error);
    return getDefaultAdvice(stats);
  }
}

function getDefaultAdvice(stats: {
  level: number;
  streak: number;
  hiraganaProgress: number;
  katakanaProgress: number;
  weakCharacters: string[];
}): CoachAdvice {
  const recommendations: string[] = [];

  if (stats.hiraganaProgress < 46) {
    recommendations.push('Continue practicing Hiragana - you\'re making great progress!');
  }
  if (stats.katakanaProgress < 20) {
    recommendations.push('Start learning Katakana to expand your reading ability.');
  }
  if (stats.weakCharacters.length > 0) {
    recommendations.push(`Focus on your weak characters: ${stats.weakCharacters.slice(0, 5).join(', ')}`);
  }
  if (recommendations.length < 3) {
    recommendations.push('Complete the Daily Challenge for bonus XP!');
  }

  return {
    greeting: stats.streak >= 3 
      ? `Great job maintaining your ${stats.streak} day streak!` 
      : 'Welcome back to your Japanese learning journey!',
    analysis: `You're at Level ${stats.level} with ${stats.hiraganaProgress}/46 Hiragana and ${stats.katakanaProgress}/46 Katakana mastered. ${stats.weakCharacters.length > 0 ? 'Some characters need extra practice.' : 'Keep up the excellent work!'}`,
    recommendations: recommendations.slice(0, 3),
    motivationalQuote: '七転び八起き (Nana korobi ya oki) - Fall seven times, stand up eight.',
  };
}

export async function sendChatMessage(
  message: string, 
  context: { level: number; hiraganaProgress: number; katakanaProgress: number; kanjiProgress: number }
): Promise<string> {
  try {
    const response = await fetch('/api/coach/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) {
      throw new Error('Failed to send chat message');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Chat API error:', error);
    return "I'm having trouble responding right now. Try asking me about Japanese characters, grammar, or learning tips!";
  }
}

export async function explainCharacter(character: string, type: 'hiragana' | 'katakana' | 'kanji'): Promise<string> {
  try {
    const response = await fetch('/api/coach/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ character, type }),
    });

    if (!response.ok) {
      throw new Error('Failed to explain character');
    }

    const data = await response.json();
    return data.explanation;
  } catch (error) {
    console.error('Coach API error:', error);
    return 'Unable to explain this character right now. Please try again later.';
  }
}
