import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore, Screen } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';

const contextualMessages: Record<Screen | 'default', string[]> = {
  home: [
    "Welcome, student! Ready to learn?",
    "今日も頑張ろう! (Let's do our best today!)",
    "The journey begins with a single character.",
    "Practice makes perfect!",
  ],
  hiragana: [
    "Hiragana is the foundation of Japanese.",
    "Each character has its own sound.",
    "あいうえお - Start with the vowels!",
    "Trace with your eyes, memorize with your heart.",
  ],
  katakana: [
    "Katakana is for foreign words.",
    "Notice the sharper, angular strokes.",
    "アイウエオ - The angular siblings!",
    "Many English words use katakana.",
  ],
  kanji: [
    "Kanji carries meaning in each stroke.",
    "一 (one), 二 (two), 三 (three)...",
    "Each kanji tells a story.",
    "Start with the radicals!",
  ],
  grammar: [
    "Grammar is the skeleton of language.",
    "は (wa) marks the topic.",
    "Particles connect words with meaning.",
    "Word order in Japanese is flexible!",
  ],
  quiz: [
    "Stay calm and trust yourself!",
    "You've prepared well for this.",
    "Focus and breathe!",
    "Speed comes with practice!",
  ],
  daily: [
    "Daily practice builds strong habits!",
    "Consistency is key to mastery.",
    "Every day is a new opportunity!",
    "Earn your XP bonus today!",
  ],
  progress: [
    "Look how far you've come!",
    "Every step counts!",
    "Your dedication inspires me!",
    "Keep climbing the mountain!",
  ],
  settings: [
    "Customize your learning journey.",
    "Find what works best for you.",
    "Comfort leads to focus.",
  ],
  coach: [
    "I'm here to guide you.",
    "Ask me anything!",
    "Together, we'll master Japanese!",
    "Your personal sensei awaits!",
  ],
  learn: [
    "Focus on memorizing the patterns.",
    "Repetition builds recognition.",
    "Take your time with each character.",
  ],
  login: [
    "Welcome back, student!",
  ],
  register: [
    "Begin your journey with us!",
  ],
  default: [
    "がんばって! (Do your best!)",
    "日本語は楽しい! (Japanese is fun!)",
    "Keep practicing every day!",
  ],
};

interface SenseiProps {
  position?: [number, number, number];
  emotion?: 'neutral' | 'happy' | 'thinking' | 'encouraging';
  message?: string;
  visible?: boolean;
  showContextual?: boolean;
}

export function SenseiCharacter({ 
  position = [0, 0, 0], 
  emotion = 'neutral',
  message,
  visible = true,
  showContextual = true
}: SenseiProps) {
  const currentScreen = useAppStore((state) => state.currentScreen);
  const streak = useUserStore((state) => state.streak);
  const level = useUserStore((state) => state.level);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);

  const contextMessage = useMemo(() => {
    if (message) return message;
    if (!showContextual) return null;
    
    if (streak >= 7) {
      return `🔥 Amazing ${streak}-day streak!`;
    }
    if (level >= 10) {
      return `⭐ Level ${level} - True dedication!`;
    }

    const messages = contextualMessages[currentScreen] || contextualMessages.default;
    return messages[messageIndex % messages.length];
  }, [message, showContextual, currentScreen, messageIndex, streak, level]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.8) * 0.05;
      headRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.03;
    }
  });

  if (!visible) return null;

  const getEyeScale = () => {
    if (blinking) return [1, 0.1, 1] as [number, number, number];
    switch (emotion) {
      case 'happy': return [1, 0.6, 1] as [number, number, number];
      default: return [1, 1, 1] as [number, number, number];
    }
  };

  const getMouthShape = () => {
    switch (emotion) {
      case 'happy': return { scaleY: 1.5, rotationZ: 0 };
      case 'thinking': return { scaleY: 0.5, rotationZ: 0.2 };
      case 'encouraging': return { scaleY: 1.2, rotationZ: 0 };
      default: return { scaleY: 1, rotationZ: 0 };
    }
  };

  const mouthShape = getMouthShape();

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        <mesh ref={bodyRef} position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.5, 1, 8, 16]} />
          <meshStandardMaterial color="#2a2a4a" roughness={0.7} />
        </mesh>

        <group position={[0, 0.5, 0.4]}>
          <mesh rotation={[0.3, 0, 0]}>
            <boxGeometry args={[1.2, 0.8, 0.1]} />
            <meshStandardMaterial color="#c41e3a" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.2, 0.05]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.4, 0.15, 0.05]} />
            <meshStandardMaterial color="#ffd700" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>

        <group ref={headRef} position={[0, 2, 0]}>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#ffd5b5" roughness={0.7} />
          </mesh>

          <mesh position={[0, 0.5, 0]}>
            <coneGeometry args={[0.55, 0.5, 32]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.15, 0.4, 0.4, 32]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
          </mesh>

          <mesh 
            ref={leftEyeRef} 
            position={[-0.15, 0.1, 0.45]} 
            scale={getEyeScale()}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[-0.15, 0.1, 0.42]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>

          <mesh 
            ref={rightEyeRef} 
            position={[0.15, 0.1, 0.45]} 
            scale={getEyeScale()}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.15, 0.1, 0.42]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="white" />
          </mesh>

          <mesh 
            ref={mouthRef} 
            position={[0, -0.15, 0.48]} 
            scale={[1, mouthShape.scaleY, 1]}
            rotation={[0, 0, mouthShape.rotationZ]}
          >
            <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>

          <mesh position={[0, 0.35, -0.2]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.4, 0.1, 0.3]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
        </group>

        <mesh position={[-0.6, 1.2, 0.2]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.12, 0.6, 4, 8]} />
          <meshStandardMaterial color="#2a2a4a" roughness={0.7} />
        </mesh>
        <mesh position={[0.6, 1.2, 0.2]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.12, 0.6, 4, 8]} />
          <meshStandardMaterial color="#2a2a4a" roughness={0.7} />
        </mesh>

        {contextMessage && showBubble && (
          <Html position={[0, 3.2, 0]} center distanceFactor={8}>
            <div 
              onClick={() => setShowBubble(false)}
              className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-[220px] shadow-xl border border-gray-200 cursor-pointer hover:bg-white transition-all"
            >
              <p className="text-sm text-gray-800 font-medium text-center leading-tight">
                {contextMessage}
              </p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/95" />
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}
