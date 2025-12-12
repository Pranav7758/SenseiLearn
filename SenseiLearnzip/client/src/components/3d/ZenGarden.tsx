import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Cloud, Stars, Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/lib/stores/useAppStore';
import { SuccessParticles, ErrorParticles, ParticleSystem } from './ParticleEffects';
import { SenseiCharacter } from './SenseiCharacter';

function SakuraTree({ position }: { position: [number, number, number] }) {
  const trunkRef = useRef<THREE.Mesh>(null);
  const leavesRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      <mesh ref={trunkRef} position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh ref={leavesRef} position={[0, 3.5, 0]}>
          <sphereGeometry args={[1.8, 16, 16]} />
          <meshStandardMaterial color="#ffb7c5" roughness={0.6} />
        </mesh>
      </Float>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i * 1.2) * 0.8, 2.8 + i * 0.3, Math.cos(i * 1.2) * 0.8]}>
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshStandardMaterial color="#ffc0cb" roughness={0.7} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Lantern({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 6]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#f5e6d3" emissive="#ffaa44" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.35, 0.3, 4]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.8, 0]} color="#ffaa44" intensity={2} distance={8} />
    </group>
  );
}

function RockGarden() {
  const rocks = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      positions.push([
        (Math.random() - 0.5) * 6,
        0.15 + Math.random() * 0.2,
        (Math.random() - 0.5) * 4 + 3,
      ]);
    }
    return positions;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 4]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#d4c4a8" roughness={1} />
      </mesh>
      {rocks.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.random() * 0.3, Math.random() * Math.PI, 0]}>
          <dodecahedronGeometry args={[0.2 + Math.random() * 0.3, 0]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Torii({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[-1.5, 2, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 4, 8]} />
        <meshStandardMaterial color="#c41e3a" roughness={0.7} />
      </mesh>
      <mesh position={[1.5, 2, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 4, 8]} />
        <meshStandardMaterial color="#c41e3a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.8, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4, 0.25, 0.3]} />
        <meshStandardMaterial color="#c41e3a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <boxGeometry args={[4.5, 0.15, 0.35]} />
        <meshStandardMaterial color="#c41e3a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[3.5, 0.15, 0.2]} />
        <meshStandardMaterial color="#c41e3a" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Bamboo({ position }: { position: [number, number, number] }) {
  const heights = useMemo(() => [3, 4, 3.5, 2.8, 4.2], []);

  return (
    <group position={position}>
      {heights.map((h, i) => (
        <group key={i} position={[(i - 2) * 0.3, 0, Math.random() * 0.3]}>
          <mesh position={[0, h / 2, 0]}>
            <cylinderGeometry args={[0.06, 0.08, h, 8]} />
            <meshStandardMaterial color="#228b22" roughness={0.6} />
          </mesh>
          {[...Array(Math.floor(h / 0.8))].map((_, j) => (
            <mesh key={j} position={[0, j * 0.8 + 0.4, 0]}>
              <torusGeometry args={[0.07, 0.02, 8, 16]} />
              <meshStandardMaterial color="#1a6b1a" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function FloatingPetals() {
  const petalsRef = useRef<THREE.Group>(null);
  const petals = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 50; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 20,
          Math.random() * 10 + 2,
          (Math.random() - 0.5) * 20,
        ] as [number, number, number],
        rotation: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (petalsRef.current) {
      petalsRef.current.children.forEach((child, i) => {
        const petal = petals[i];
        child.position.y = petal.position[1] + Math.sin(clock.elapsedTime * petal.speed + petal.offset) * 0.5;
        child.position.x = petal.position[0] + Math.sin(clock.elapsedTime * 0.3 + petal.offset) * 2;
        child.rotation.z = clock.elapsedTime * petal.speed;
        if (child.position.y < 0) {
          child.position.y = 10;
        }
      });
    }
  });

  return (
    <group ref={petalsRef}>
      {petals.map((petal, i) => (
        <mesh key={i} position={petal.position} rotation={[0, 0, petal.rotation]}>
          <circleGeometry args={[0.05, 6]} />
          <meshBasicMaterial color="#ffb7c5" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Pond() {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (waterRef.current && waterRef.current.material instanceof THREE.MeshStandardMaterial) {
      waterRef.current.material.emissiveIntensity = 0.1 + Math.sin(clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group position={[-5, 0, 2]}>
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial 
          color="#4a90a4" 
          roughness={0.1} 
          metalness={0.8}
          emissive="#1a4a5a"
          emissiveIntensity={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.9, 2.3, 32]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function ZenGarden() {
  const activeParticleEffect = useAppStore((state) => state.activeParticleEffect);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#3a5a3a" roughness={0.9} />
      </mesh>

      <Sky 
        distance={450000} 
        sunPosition={[100, 20, 100]} 
        inclination={0.5}
        azimuth={0.25}
        mieCoefficient={0.005}
        rayleigh={0.5}
      />
      
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

      <SakuraTree position={[-6, 0, -4]} />
      <SakuraTree position={[7, 0, -3]} />
      <SakuraTree position={[-8, 0, 5]} />

      <Bamboo position={[8, 0, 4]} />
      <Bamboo position={[-9, 0, -2]} />

      <Lantern position={[-3, 0, 2]} />
      <Lantern position={[3, 0, 2]} />
      <Lantern position={[0, 0, 6]} />

      <RockGarden />
      <Pond />

      <Torii position={[0, 0, -8]} />

      <FloatingPetals />

      <Cloud position={[-10, 12, -10]} speed={0.2} opacity={0.3} />
      <Cloud position={[10, 14, -15]} speed={0.3} opacity={0.2} />
      <Cloud position={[0, 15, -20]} speed={0.1} opacity={0.4} />

      <SuccessParticles position={[0, 3, 0]} active={activeParticleEffect === 'success'} />
      <ErrorParticles position={[0, 3, 0]} active={activeParticleEffect === 'error'} />
      
      {activeParticleEffect === 'xp' && (
        <ParticleSystem type="xp" position={[0, 2, 0]} active={true} count={30} />
      )}

      <SenseiCharacter position={[6, 0, 2]} />

      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffeedd" />
    </group>
  );
}
