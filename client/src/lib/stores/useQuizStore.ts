import { create } from 'zustand';
import type { KanaCharacter } from '@/data/hiragana';
import type { KanjiCharacter } from '@/data/kanji';
import type { GrammarQuestion } from '@/data/grammar';

export type QuizType = 'hiragana' | 'katakana' | 'kanji' | 'grammar' | 'daily';
export type QuestionType = 'recognition' | 'typing' | 'meaning' | 'reading' | 'grammar';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  character?: string;
  romaji?: string;
  meaning?: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface QuizState {
  isActive: boolean;
  quizType: QuizType | null;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  timeRemaining: number;
  timerInterval: number;
  isTimerRunning: boolean;
  quizComplete: boolean;
  xpEarned: number;
  answeredQuestions: QuizQuestion[];
  
  startQuiz: (type: QuizType, questions: QuizQuestion[], timerInterval: number) => void;
  answerQuestion: (answer: string, timeSpent: number) => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
  setTimeRemaining: (time: number) => void;
  getCurrentQuestion: () => QuizQuestion | null;
  getAccuracy: () => number;
  getWeakCharacters: () => string[];
}

export const useQuizStore = create<QuizState>((set, get) => ({
  isActive: false,
  quizType: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  totalQuestions: 0,
  timeRemaining: 0,
  timerInterval: 3,
  isTimerRunning: false,
  quizComplete: false,
  xpEarned: 0,
  answeredQuestions: [],

  startQuiz: (type, questions, timerInterval) => set({
    isActive: true,
    quizType: type,
    questions,
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: questions.length,
    timeRemaining: timerInterval,
    timerInterval,
    isTimerRunning: true,
    quizComplete: false,
    xpEarned: 0,
    answeredQuestions: [],
  }),

  answerQuestion: (answer, timeSpent) => set((state) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return state;

    const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    const xpGained = isCorrect ? (state.quizType === 'daily' ? 15 : 10) : 0;

    const answeredQuestion: QuizQuestion = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect,
      timeSpent,
    };

    return {
      score: state.score + (isCorrect ? 1 : 0),
      xpEarned: state.xpEarned + xpGained,
      answeredQuestions: [...state.answeredQuestions, answeredQuestion],
      isTimerRunning: false,
    };
  }),

  nextQuestion: () => set((state) => {
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex >= state.questions.length) {
      return {
        quizComplete: true,
        isTimerRunning: false,
      };
    }
    return {
      currentQuestionIndex: nextIndex,
      timeRemaining: state.timerInterval,
      isTimerRunning: true,
    };
  }),

  endQuiz: () => set({
    quizComplete: true,
    isTimerRunning: false,
  }),

  resetQuiz: () => set({
    isActive: false,
    quizType: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    timeRemaining: 0,
    timerInterval: 3,
    isTimerRunning: false,
    quizComplete: false,
    xpEarned: 0,
    answeredQuestions: [],
  }),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  getCurrentQuestion: () => {
    const state = get();
    return state.questions[state.currentQuestionIndex] || null;
  },

  getAccuracy: () => {
    const state = get();
    if (state.answeredQuestions.length === 0) return 0;
    const correct = state.answeredQuestions.filter((q) => q.isCorrect).length;
    return Math.round((correct / state.answeredQuestions.length) * 100);
  },

  getWeakCharacters: () => {
    const state = get();
    return state.answeredQuestions
      .filter((q) => !q.isCorrect && q.character)
      .map((q) => q.character!);
  },
}));

export function generateKanaQuestions(
  characters: KanaCharacter[],
  count: number = 10,
  type: 'recognition' | 'typing' = 'recognition'
): QuizQuestion[] {
  const shuffled = [...characters].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, characters.length));
  
  return selected.map((char, index) => {
    const wrongAnswers = characters
      .filter((c) => c.romaji !== char.romaji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.romaji);

    const options = [...wrongAnswers, char.romaji].sort(() => Math.random() - 0.5);

    return {
      id: `q-${index}-${Date.now()}`,
      type,
      character: char.character,
      romaji: char.romaji,
      options,
      correctAnswer: char.romaji,
    };
  });
}

export function generateKanjiQuestions(
  kanji: KanjiCharacter[],
  count: number = 10,
  questionType: 'meaning' | 'reading' = 'meaning'
): QuizQuestion[] {
  const shuffled = [...kanji].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, kanji.length));

  return selected.map((k, index) => {
    if (questionType === 'meaning') {
      const wrongAnswers = kanji
        .filter((kj) => kj.meaning !== k.meaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((kj) => kj.meaning);

      const options = [...wrongAnswers, k.meaning].sort(() => Math.random() - 0.5);

      return {
        id: `q-${index}-${Date.now()}`,
        type: 'meaning' as QuestionType,
        character: k.character,
        meaning: k.meaning,
        options,
        correctAnswer: k.meaning,
      };
    } else {
      const reading = k.kunyomi[0] || k.onyomi[0];
      const wrongAnswers = kanji
        .filter((kj) => (kj.kunyomi[0] || kj.onyomi[0]) !== reading)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((kj) => kj.kunyomi[0] || kj.onyomi[0]);

      const options = [...wrongAnswers, reading].sort(() => Math.random() - 0.5);

      return {
        id: `q-${index}-${Date.now()}`,
        type: 'reading' as QuestionType,
        character: k.character,
        romaji: reading,
        options,
        correctAnswer: reading,
      };
    }
  });
}

export function generateGrammarQuestions(
  questions: GrammarQuestion[],
  count: number = 10
): QuizQuestion[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, questions.length));

  return selected.map((q, index) => ({
    id: `q-${index}-${Date.now()}`,
    type: 'grammar' as QuestionType,
    character: q.question,
    options: q.options || [q.correctAnswer],
    correctAnswer: q.correctAnswer,
    meaning: q.explanation,
  }));
}
