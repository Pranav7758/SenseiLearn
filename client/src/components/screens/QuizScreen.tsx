import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/lib/stores/useQuizStore';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useAudio } from '@/lib/stores/useAudio';
import ReactConfetti from 'react-confetti';

export function QuizScreen() {
  const [inputAnswer, setInputAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const {
    isActive,
    quizType,
    currentQuestionIndex,
    score,
    totalQuestions,
    timeRemaining,
    timerInterval,
    isTimerRunning,
    quizComplete,
    xpEarned,
    answeredQuestions,
    answerQuestion,
    nextQuestion,
    getCurrentQuestion,
    getAccuracy,
    getWeakCharacters,
    resetQuiz,
  } = useQuizStore();

  const { addXp, updateCharacterProgress, updateStreak, incrementQuizCount, incrementSpeedAnswers, settings } = useUserStore();
  const { setScreen, goBack, addNotification, triggerParticleEffect } = useAppStore();
  const { playHit, playSuccess } = useAudio();

  const currentQuestion = getCurrentQuestion();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isTimerRunning || quizComplete || showFeedback) return;

    const timer = setInterval(() => {
      useQuizStore.setState((state) => {
        if (state.timeRemaining <= 0.1) {
          return state;
        }
        return { timeRemaining: state.timeRemaining - 0.1 };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isTimerRunning, quizComplete, showFeedback]);

  useEffect(() => {
    if (timeRemaining <= 0 && isTimerRunning && !showFeedback) {
      handleAnswer('');
    }
  }, [timeRemaining, isTimerRunning, showFeedback]);

  const handleAnswer = useCallback((answer: string) => {
    if (!currentQuestion || showFeedback) return;

    const timeSpent = timerInterval - timeRemaining;
    answerQuestion(answer, timeSpent);
    
    const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    
    if (isCorrect) {
      playSuccess();
      triggerParticleEffect('success');
      if (timeSpent <= 2) {
        incrementSpeedAnswers();
      }
    } else {
      playHit();
      triggerParticleEffect('error');
    }

    if (currentQuestion.character && quizType && ['hiragana', 'katakana', 'kanji'].includes(quizType)) {
      updateCharacterProgress(currentQuestion.character, quizType as any, isCorrect);
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setInputAnswer('');
      nextQuestion();
    }, 1000);
  }, [currentQuestion, showFeedback, timerInterval, timeRemaining, answerQuestion, playSuccess, playHit, incrementSpeedAnswers, updateCharacterProgress, quizType, nextQuestion]);

  const handleQuizComplete = () => {
    addXp(xpEarned);
    updateStreak();
    const accuracy = getAccuracy();
    incrementQuizCount(accuracy === 100);
    
    addNotification({
      type: 'success',
      title: 'Quiz Complete!',
      message: `You earned ${xpEarned} XP with ${accuracy}% accuracy`,
    });

    resetQuiz();
    goBack();
  };

  if (!isActive || !currentQuestion) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">No active quiz</p>
          <button
            onClick={() => setScreen('home')}
            className="mt-4 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const accuracy = getAccuracy();
    const weakChars = getWeakCharacters();

    return (
      <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
        {accuracy >= 80 && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20"
        >
          <div className="text-6xl mb-6">
            {accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-white/70 mb-6">Great effort on your {quizType} practice</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-400">{score}</p>
              <p className="text-xs text-white/60">Correct</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{accuracy}%</p>
              <p className="text-xs text-white/60">Accuracy</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-yellow-400">+{xpEarned}</p>
              <p className="text-xs text-white/60">XP Earned</p>
            </div>
          </div>

          {weakChars.length > 0 && (
            <div className="bg-red-500/20 rounded-xl p-4 mb-6 border border-red-500/30">
              <p className="text-sm text-red-400 mb-2">Characters to practice:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {weakChars.slice(0, 8).map((char) => (
                  <span key={char} className="text-xl text-white bg-red-500/30 px-3 py-1 rounded-lg">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleQuizComplete}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all"
          >
            Continue
          </button>
        </motion.div>
      </div>
    );
  }

  const timerProgress = timeRemaining / timerInterval;
  const lastAnswer = answeredQuestions[answeredQuestions.length - 1];

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-white font-medium">
              Score: {score}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                timerProgress > 0.5 ? 'bg-green-500' :
                timerProgress > 0.25 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              animate={{ width: `${timerProgress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-center text-white/60 text-sm mt-1">
            {timeRemaining.toFixed(1)}s
          </p>
        </div>

        <motion.div
          key={currentQuestion.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 text-center border border-white/20"
        >
          <AnimatePresence mode="wait">
            {showFeedback ? (
              <motion.div
                key="feedback"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="py-8"
              >
                <div className={`text-8xl mb-4 ${lastAnswer?.isCorrect ? 'animate-bounce' : 'animate-pulse'}`}>
                  {lastAnswer?.isCorrect ? '✓' : '✗'}
                </div>
                <p className={`text-2xl font-bold ${lastAnswer?.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {lastAnswer?.isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {!lastAnswer?.isCorrect && (
                  <p className="text-white/70 mt-2">
                    Answer: {currentQuestion.correctAnswer}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-8xl font-bold text-white mb-4">
                  {currentQuestion.character}
                </p>
                {currentQuestion.type === 'meaning' && (
                  <p className="text-white/60">What is the meaning?</p>
                )}
                {currentQuestion.type === 'reading' && (
                  <p className="text-white/60">What is the reading?</p>
                )}
                {currentQuestion.type === 'grammar' && (
                  <p className="text-white/80 text-lg">{currentQuestion.character}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {currentQuestion.type === 'typing' ? (
          <div className="space-y-4">
            <input
              type="text"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnswer(inputAnswer)}
              placeholder="Type your answer..."
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-xl placeholder-white/40 focus:outline-none focus:border-white/40"
              autoFocus
              disabled={showFeedback}
            />
            <button
              onClick={() => handleAnswer(inputAnswer)}
              disabled={showFeedback || !inputAnswer}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all"
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`py-4 px-6 rounded-xl text-lg font-medium transition-all ${
                  showFeedback
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-500 text-white'
                      : option === lastAnswer?.userAnswer && !lastAnswer?.isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white/50'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              resetQuiz();
              goBack();
            }}
            className="text-white/60 hover:text-white transition-all"
          >
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
