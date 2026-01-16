import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  emotion?: 'neutral' | 'excited' | 'thinking' | 'happy' | 'focused';
  isSpeaking?: boolean;
}

export const Avatar3D: React.FC<Avatar3DProps> = ({ 
  emotion = 'neutral',
  isSpeaking = false 
}) => {
  const avatarRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const [blinkTime, setBlinkTime] = useState(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Gentle floating animation
    if (avatarRef.current) {
      const floatIntensity = emotion === 'excited' ? 0.15 : 0.1;
      const floatSpeed = emotion === 'excited' ? 3 : 2;
      avatarRef.current.position.y = Math.sin(time * floatSpeed) * floatIntensity;
    }
    
    // Head movement based on emotion
    if (headRef.current) {
      const lookIntensity = emotion === 'thinking' ? 0.2 : 0.1;
      const lookSpeed = emotion === 'excited' ? 1.2 : 0.8;
      
      headRef.current.rotation.y = Math.sin(time * lookSpeed) * lookIntensity;
      headRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
      
      // Slight head bounce when speaking
      if (isSpeaking) {
        headRef.current.position.y = 1.2 + Math.sin(time * 8) * 0.02;
      }
    }

    // Eye blinking animation
    if (time > blinkTime + 2 + Math.random() * 3) {
      setBlinkTime(time);
    }
    
    const blinkProgress = Math.max(0, 1 - Math.abs(time - blinkTime - 0.1) * 10);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = 1 - blinkProgress * 0.9;
      rightEyeRef.current.scale.y = 1 - blinkProgress * 0.9;
    }
  });

  // Emotion-based colors
  const getEmotionColors = () => {
    switch (emotion) {
      case 'excited':
        return { body: '#10B981', face: '#FEF3C7' };
      case 'thinking':
        return { body: '#8B5CF6', face: '#FFD4A3' };
      case 'happy':
        return { body: '#F59E0B', face: '#FEF3C7' };
      case 'focused':
        return { body: '#3B82F6', face: '#FFD4A3' };
      default:
        return { body: '#4F46E5', face: '#FFD4A3' };
    }
  };

  const colors = getEmotionColors();

  return (
    <group ref={avatarRef} position={[0, 0, 0]}>
      {/* Head */}
      <Sphere ref={headRef} args={[0.8, 32, 32]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color={colors.face} />
      </Sphere>
      
      {/* Eyes */}
      <Sphere ref={leftEyeRef} args={[0.1, 16, 16]} position={[-0.2, 1.3, 0.7]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      <Sphere ref={rightEyeRef} args={[0.1, 16, 16]} position={[0.2, 1.3, 0.7]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      
      {/* Mouth - changes with emotion */}
      <Box 
        args={emotion === 'happy' ? [0.15, 0.05, 0.05] : [0.1, 0.03, 0.03]} 
        position={[0, 1.0, 0.7]}
      >
        <meshStandardMaterial color={emotion === 'happy' ? '#FF6B6B' : '#8B4513'} />
      </Box>
      
      {/* Body */}
      <Box args={[1.2, 1.5, 0.8]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color={colors.body} />
      </Box>
      
      {/* Arms */}
      <Box args={[0.3, 1.2, 0.3]} position={[-0.8, 0, 0]}>
        <meshStandardMaterial color={colors.face} />
      </Box>
      <Box args={[0.3, 1.2, 0.3]} position={[0.8, 0, 0]}>
        <meshStandardMaterial color={colors.face} />
      </Box>
      
      {/* Legs */}
      <Box args={[0.4, 1.2, 0.4]} position={[-0.3, -1.5, 0]}>
        <meshStandardMaterial color="#1E40AF" />
      </Box>
      <Box args={[0.4, 1.2, 0.4]} position={[0.3, -1.5, 0]}>
        <meshStandardMaterial color="#1E40AF" />
      </Box>
      
      {/* Thinking indicator */}
      {emotion === 'thinking' && (
        <group position={[1.2, 2, 0]}>
          <Sphere args={[0.1, 8, 8]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
          </Sphere>
          <Sphere args={[0.15, 8, 8]} position={[0.3, 0.2, 0]}>
            <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
          </Sphere>
          <Sphere args={[0.2, 8, 8]} position={[0.6, 0.4, 0]}>
            <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
          </Sphere>
        </group>
      )}
    </group>
  );
};