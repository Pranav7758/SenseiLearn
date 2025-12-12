import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingCardProps {
  character: string;
  romaji?: string;
  meaning?: string;
  position?: [number, number, number];
  onClick?: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  showRomaji?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function FloatingCard({
  character,
  romaji,
  meaning,
  position = [0, 0, 0],
  onClick,
  isSelected = false,
  isCorrect = false,
  isIncorrect = false,
  showRomaji = true,
  size = 'medium',
}: FloatingCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const sizeMultiplier = size === 'small' ? 0.6 : size === 'large' ? 1.5 : 1;
  const cardWidth = 1.5 * sizeMultiplier;
  const cardHeight = 2 * sizeMultiplier;

  const getCardColor = () => {
    if (isCorrect) return '#22c55e';
    if (isIncorrect) return '#ef4444';
    if (isSelected) return '#3b82f6';
    if (hovered) return '#60a5fa';
    return '#ffffff';
  };

  const getEmissive = () => {
    if (isCorrect) return '#22c55e';
    if (isIncorrect) return '#ef4444';
    if (isSelected || hovered) return '#3b82f6';
    return '#000000';
  };

  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (isCorrect) {
        groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 3) * 0.1;
        groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 4) * 0.1;
      } else if (isIncorrect) {
        groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 20) * 0.05;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} enabled={!isCorrect && !isIncorrect}>
      <group 
        ref={groupRef} 
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered && !isCorrect && !isIncorrect ? 1.1 : 1}
      >
        <RoundedBox 
          args={[cardWidth, cardHeight, 0.1]} 
          radius={0.1} 
          smoothness={4}
        >
          <meshStandardMaterial 
            color={getCardColor()} 
            roughness={0.3}
            metalness={0.1}
            emissive={getEmissive()}
            emissiveIntensity={0.2}
          />
        </RoundedBox>

        <RoundedBox 
          args={[cardWidth - 0.1, cardHeight - 0.1, 0.02]} 
          radius={0.08} 
          smoothness={4}
          position={[0, 0, 0.06]}
        >
          <meshStandardMaterial 
            color="#fafafa" 
            roughness={0.5}
          />
        </RoundedBox>

        <Text
          position={[0, meaning ? 0.2 : 0, 0.08]}
          fontSize={0.6 * sizeMultiplier}
          color="#1a1a1a"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          {character}
        </Text>

        {showRomaji && romaji && (
          <Text
            position={[0, -0.4 * sizeMultiplier, 0.08]}
            fontSize={0.2 * sizeMultiplier}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            {romaji}
          </Text>
        )}

        {meaning && (
          <Text
            position={[0, -0.6 * sizeMultiplier, 0.08]}
            fontSize={0.15 * sizeMultiplier}
            color="#888888"
            anchorX="center"
            anchorY="middle"
            maxWidth={cardWidth - 0.2}
          >
            {meaning}
          </Text>
        )}

        {(isCorrect || isIncorrect) && (
          <mesh position={[cardWidth / 2 - 0.2, cardHeight / 2 - 0.2, 0.1]}>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial color={isCorrect ? '#22c55e' : '#ef4444'} />
          </mesh>
        )}

        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[cardWidth, cardHeight, 0.02]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}
