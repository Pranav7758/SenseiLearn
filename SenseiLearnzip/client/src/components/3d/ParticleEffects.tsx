import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  color?: string;
  position?: [number, number, number];
  type?: 'celebration' | 'sparkle' | 'xp' | 'streak';
  active?: boolean;
}

export function ParticleSystem({
  count = 50,
  color = '#ffd700',
  position = [0, 0, 0],
  type = 'sparkle',
  active = true,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorObj = new THREE.Color(color);
    const celebrationColors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      if (type === 'celebration') {
        positions[i3] = (Math.random() - 0.5) * 2;
        positions[i3 + 1] = Math.random() * 3;
        positions[i3 + 2] = (Math.random() - 0.5) * 2;
        velocities[i3] = (Math.random() - 0.5) * 0.1;
        velocities[i3 + 1] = Math.random() * 0.1 + 0.05;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
        const c = new THREE.Color(celebrationColors[Math.floor(Math.random() * celebrationColors.length)]);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
      } else if (type === 'xp') {
        const angle = (i / count) * Math.PI * 2;
        positions[i3] = Math.cos(angle) * 0.5;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(angle) * 0.5;
        velocities[i3] = Math.cos(angle) * 0.02;
        velocities[i3 + 1] = 0.05 + Math.random() * 0.03;
        velocities[i3 + 2] = Math.sin(angle) * 0.02;
        colors[i3] = colorObj.r;
        colors[i3 + 1] = colorObj.g;
        colors[i3 + 2] = colorObj.b;
      } else if (type === 'streak') {
        positions[i3] = (Math.random() - 0.5) * 1;
        positions[i3 + 1] = Math.random() * 2;
        positions[i3 + 2] = (Math.random() - 0.5) * 1;
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = 0.02 + Math.random() * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        const fireColors = ['#ff4500', '#ff6347', '#ffa500', '#ffd700'];
        const c = new THREE.Color(fireColors[Math.floor(Math.random() * fireColors.length)]);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
      } else {
        positions[i3] = (Math.random() - 0.5) * 3;
        positions[i3 + 1] = Math.random() * 2;
        positions[i3 + 2] = (Math.random() - 0.5) * 3;
        velocities[i3] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 1] = 0.01 + Math.random() * 0.01;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
        colors[i3] = colorObj.r;
        colors[i3 + 1] = colorObj.g;
        colors[i3 + 2] = colorObj.b;
      }
    }

    return { positions, velocities, colors };
  }, [count, color, type]);

  useFrame(() => {
    if (!pointsRef.current || !active) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = positionAttribute.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      if (type === 'celebration') {
        velocities[i3 + 1] -= 0.002;
        if (posArray[i3 + 1] < 0) {
          posArray[i3] = (Math.random() - 0.5) * 2;
          posArray[i3 + 1] = 3;
          posArray[i3 + 2] = (Math.random() - 0.5) * 2;
          velocities[i3 + 1] = Math.random() * 0.1 + 0.05;
        }
      } else if (posArray[i3 + 1] > 5) {
        posArray[i3] = (Math.random() - 0.5) * 3;
        posArray[i3 + 1] = 0;
        posArray[i3 + 2] = (Math.random() - 0.5) * 3;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={type === 'celebration' ? 0.1 : 0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

interface XPGainEffectProps {
  amount: number;
  position?: [number, number, number];
  onComplete?: () => void;
}

export function XPGainEffect({ amount, position = [0, 0, 0], onComplete }: XPGainEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!groupRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    const duration = 1.5;

    if (elapsed < duration) {
      groupRef.current.position.y = position[1] + elapsed * 2;
      const scale = 1 - (elapsed / duration) * 0.5;
      groupRef.current.scale.set(scale, scale, scale);
      
      if (groupRef.current.children[0]) {
        (groupRef.current.children[0] as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: '#ffd700',
          transparent: true,
          opacity: 1 - elapsed / duration,
        });
      }
    } else {
      onComplete?.();
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <ParticleSystem type="xp" count={20} active={true} />
    </group>
  );
}

interface BurstEffectProps {
  position?: [number, number, number];
  active?: boolean;
  type?: 'success' | 'error';
}

export function BurstEffect({ position = [0, 0, 0], active = false, type = 'success' }: BurstEffectProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const startTime = useRef(0);
  const isActive = useRef(false);

  const { positions, velocities, colors } = useMemo(() => {
    const count = type === 'success' ? 60 : 30;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const successColors = ['#4ade80', '#22c55e', '#86efac', '#fbbf24', '#34d399'];
    const errorColors = ['#ef4444', '#f87171', '#fca5a5', '#dc2626'];
    const colorSet = type === 'success' ? successColors : errorColors;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.3) * Math.PI;
      const speed = Math.random() * 4 + 2;

      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;

      velocities[i3] = Math.cos(angle) * Math.cos(elevation) * speed;
      velocities[i3 + 1] = Math.sin(elevation) * speed + 2;
      velocities[i3 + 2] = Math.sin(angle) * Math.cos(elevation) * speed;

      const c = new THREE.Color(colorSet[Math.floor(Math.random() * colorSet.length)]);
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    return { positions, velocities, colors };
  }, [type]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    if (active && !isActive.current) {
      isActive.current = true;
      startTime.current = Date.now();
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        posAttr.array[i * 3] = 0;
        posAttr.array[i * 3 + 1] = 0;
        posAttr.array[i * 3 + 2] = 0;
      }
      posAttr.needsUpdate = true;
    }

    if (!active) {
      isActive.current = false;
      return;
    }

    const elapsed = (Date.now() - startTime.current) / 1000;
    if (elapsed > 1.5) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posAttr.array[i3] += velocities[i3] * delta;
      posAttr.array[i3 + 1] += velocities[i3 + 1] * delta;
      posAttr.array[i3 + 2] += velocities[i3 + 2] * delta;
      velocities[i3 + 1] -= 8 * delta;
    }

    posAttr.needsUpdate = true;
    
    if (pointsRef.current.material) {
      (pointsRef.current.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - elapsed / 1.2);
    }
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={type === 'success' ? 60 : 30}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={type === 'success' ? 60 : 30}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={type === 'success' ? 0.15 : 0.1}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function SuccessParticles({ position = [0, 0, 0], active = false }: { position?: [number, number, number]; active?: boolean }) {
  return <BurstEffect position={position} active={active} type="success" />;
}

export function ErrorParticles({ position = [0, 0, 0], active = false }: { position?: [number, number, number]; active?: boolean }) {
  return <BurstEffect position={position} active={active} type="error" />;
}
