import { useEffect } from "react";
import { useAppStore } from "./lib/stores/useAppStore";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

import { Navbar, BottomNavbar, NotificationContainer, LoadingOverlay } from "./components/ui/GameUI";
import { HomeScreen } from "./components/screens/HomeScreen";
import { KanaScreen } from "./components/screens/KanaScreen";
import { KanjiScreen } from "./components/screens/KanjiScreen";
import { GrammarScreen } from "./components/screens/GrammarScreen";
import { QuizScreen } from "./components/screens/QuizScreen";
import { LearnScreen } from "./components/screens/LearnScreen";
import { DailyChallengeScreen } from "./components/screens/DailyChallengeScreen";
import { ProgressScreen } from "./components/screens/ProgressScreen";
import { SettingsScreen } from "./components/screens/SettingsScreen";
import { CoachScreen } from "./components/screens/CoachScreen";
import { MiniGamesScreen } from "./components/screens/MiniGamesScreen";
import { NinjaKanaGame } from "./components/screens/NinjaKanaGame";
import { KanjiMatchGame } from "./components/screens/KanjiMatchGame";
import { WordBuilderGame } from "./components/screens/WordBuilderGame";
import { CharacterCatchGame } from "./components/screens/CharacterCatchGame";
import { ListeningChallengeGame } from "./components/screens/ListeningChallengeGame";
import { SentenceScrambleGame } from "./components/screens/SentenceScrambleGame";
import { BossBattleGame } from "./components/screens/BossBattleGame";
import { VocabularyRaceGame } from "./components/screens/VocabularyRaceGame";
import { VocabularyScreen } from "./components/screens/VocabularyScreen";
import { AuthModal } from "./components/screens/AuthModal";
import { useAchievementChecker } from "./hooks/useAchievementChecker";

function DarkBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(100,40,120,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(60,20,80,0.08),transparent)]" />
    </div>
  );
}

function ScreenRouter() {
  const { currentScreen, learnMode } = useAppStore();

  // Only show LearnScreen if learnMode is active AND we're on the 'learn' screen
  // This allows games to work even if learnMode wasn't properly cleared
  if (learnMode && currentScreen === 'learn') {
    return <LearnScreen />;
  }

  switch (currentScreen) {
    case 'home':
      return <HomeScreen />;
    case 'hiragana':
      return <KanaScreen type="hiragana" />;
    case 'katakana':
      return <KanaScreen type="katakana" />;
    case 'kanji':
      return <KanjiScreen />;
    case 'grammar':
      return <GrammarScreen />;
    case 'vocabulary':
      return <VocabularyScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'daily':
      return <DailyChallengeScreen />;
    case 'progress':
      return <ProgressScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'coach':
      return <CoachScreen />;
    case 'games':
      return <MiniGamesScreen />;
    case 'ninja-kana':
      return <NinjaKanaGame />;
    case 'kanji-match':
      return <KanjiMatchGame />;
    case 'word-builder':
      return <WordBuilderGame />;
    case 'character-catch':
      return <CharacterCatchGame />;
    case 'listening-challenge':
      return <ListeningChallengeGame />;
    case 'sentence-scramble':
      return <SentenceScrambleGame />;
    case 'boss-battle':
      return <BossBattleGame />;
    case 'vocabulary-race':
      return <VocabularyRaceGame />;
    default:
      return <HomeScreen />;
  }
}

function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hitSound = new Audio('/sounds/hit.mp3');
    hitSound.volume = 0.5;
    setHitSound(hitSound);

    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.5;
    setSuccessSound(successSound);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return null;
}

function AchievementManager() {
  useAchievementChecker();
  return null;
}

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <DarkBackground />
      
      <div className="relative z-10 w-full h-full overflow-y-auto pb-20">
        <Navbar />
        <ScreenRouter />
      </div>

      <BottomNavbar />
      <NotificationContainer />
      <LoadingOverlay />
      <AuthModal />
      <SoundManager />
      <AchievementManager />
    </div>
  );
}

export default App;
