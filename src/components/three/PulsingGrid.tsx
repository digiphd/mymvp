'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 3D Tetris-style block that can glitch
function TetrisBlock({ position, delay, blockType }: { 
  position: [number, number, number], 
  delay: number,
  blockType: 'I' | 'O' | 'T' | 'L' | 'J' | 'S' | 'Z' | 'single'
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [glitchState, setGlitchState] = useState<'idle' | 'glitching' | 'forming'>('idle')
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  
  // Tetris block shapes (relative positions)
  const blockShapes = useMemo(() => ({
    'I': [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0]], // Line
    'O': [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]], // Square
    'T': [[0, 0, 0], [-1, 0, 0], [1, 0, 0], [0, 1, 0]], // T-shape
    'L': [[0, 0, 0], [0, 1, 0], [0, 2, 0], [1, 2, 0]], // L-shape
    'J': [[0, 0, 0], [0, 1, 0], [0, 2, 0], [-1, 2, 0]], // J-shape
    'S': [[0, 0, 0], [1, 0, 0], [-1, 1, 0], [0, 1, 0]], // S-shape
    'Z': [[0, 0, 0], [-1, 0, 0], [0, 1, 0], [1, 1, 0]], // Z-shape
    'single': [[0, 0, 0]] // Single block
  }), [])

  const currentShape = blockShapes[blockType]
  
  useFrame((state) => {
    if (groupRef.current) {
      // Random glitch activation
      if (glitchState === 'idle' && Math.random() < 0.001) {
        setGlitchState('glitching')
        setGlitchIntensity(1)
        setTimeout(() => {
          setGlitchState('forming')
          setTimeout(() => setGlitchState('idle'), 2000)
        }, 300 + Math.random() * 500)
      }
      
      // Handle different states
      switch (glitchState) {
        case 'glitching':
          // Rapid position/rotation changes for glitch effect
          const glitch = Math.sin(state.clock.elapsedTime * 50 + delay) * 0.1
          groupRef.current.position.x += glitch * glitchIntensity
          groupRef.current.position.y += glitch * glitchIntensity * 0.5
          groupRef.current.rotation.z += glitch * 0.2
          
          // Glitch intensity decay
          setGlitchIntensity(prev => Math.max(0, prev - 0.02))
          break
          
        case 'forming':
          // Smooth formation animation
          const formTime = (state.clock.elapsedTime * 2 + delay) % (Math.PI * 2)
          groupRef.current.children.forEach((child, i) => {
            const scale = Math.max(0.1, Math.sin(formTime + i * 0.3) * 0.5 + 0.5)
            child.scale.setScalar(scale)
          })
          break
          
        case 'idle':
          // Subtle breathing
          const breath = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.02 + 1
          groupRef.current.scale.setScalar(breath)
          
          // Reset positions
          groupRef.current.position.x = position[0]
          groupRef.current.position.y = position[1]
          groupRef.current.rotation.z = 0
          break
      }
    }
  })

  const getBlockColor = () => {
    const colors = {
      'I': '#00F5FF', // Cyan
      'O': '#FFFF00', // Yellow  
      'T': '#800080', // Purple
      'L': '#FFA500', // Orange
      'J': '#0000FF', // Blue
      'S': '#008000', // Green
      'Z': '#FF0000', // Red
      'single': '#3ECF8E' // Supabase green
    }
    return colors[blockType]
  }

  const opacity = glitchState === 'glitching' ? 0.8 : glitchState === 'forming' ? 0.6 : 0.15

  return (
    <group ref={groupRef} position={position}>
      {currentShape.map((relPos, index) => (
        <mesh 
          key={index} 
          position={[relPos[0] * 0.9, relPos[1] * 0.9, relPos[2] * 0.9]}
        >
          <boxGeometry args={[0.8, 0.8, 0.3]} />
          <meshStandardMaterial 
            color={getBlockColor()}
            transparent 
            opacity={opacity}
            emissive={glitchState !== 'idle' ? getBlockColor() : '#000000'}
            emissiveIntensity={glitchState === 'glitching' ? 0.3 : 0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main grid pattern with Tetris blocks
function TetrisGrid() {
  const tetrisBlocks = useMemo(() => {
    const blocks = []
    const gridSize = 12
    const spacing = 2
    const blockTypes: Array<'I' | 'O' | 'T' | 'L' | 'J' | 'S' | 'Z' | 'single'> = 
      ['I', 'O', 'T', 'L', 'J', 'S', 'Z', 'single']
    
    for (let x = -gridSize/2; x < gridSize/2; x += 2) {
      for (let y = -gridSize/2; y < gridSize/2; y += 2) {
        // Randomly place different block types with varying probability
        const rand = Math.random()
        let blockType: 'I' | 'O' | 'T' | 'L' | 'J' | 'S' | 'Z' | 'single'
        
        if (rand < 0.7) {
          blockType = 'single' // Most common
        } else if (rand < 0.85) {
          blockType = 'O' // Square blocks
        } else {
          blockType = blockTypes[Math.floor(Math.random() * (blockTypes.length - 1))]
        }
        
        blocks.push({
          position: [x * spacing, y * spacing, 0] as [number, number, number],
          delay: (x + y) * 0.2,
          blockType
        })
      }
    }
    
    return blocks
  }, [])

  return (
    <group>
      {tetrisBlocks.map((block, index) => (
        <TetrisBlock 
          key={index} 
          position={block.position} 
          delay={block.delay}
          blockType={block.blockType}
        />
      ))}
    </group>
  )
}

// Tetris-style background grid lines
function TetrisGridLines() {
  const linesRef = useRef<THREE.LineSegments>(null)
  
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const gridSize = 24
    const blockSize = 2 // Tetris block size
    
    // Create Tetris-style grid (larger squares)
    for (let i = -gridSize/2; i <= gridSize/2; i += blockSize) {
      vertices.push(-gridSize/2, i, 0, gridSize/2, i, 0)
    }
    
    for (let i = -gridSize/2; i <= gridSize/2; i += blockSize) {
      vertices.push(i, -gridSize/2, 0, i, gridSize/2, 0)
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geometry
  }, [])

  useFrame((state) => {
    if (linesRef.current) {
      const pulse = 0.05 + Math.sin(state.clock.elapsedTime * 0.3) * 0.03
      linesRef.current.material.opacity = pulse
    }
  })

  return (
    <lineSegments ref={linesRef}>
      <primitive object={gridGeometry} />
      <lineBasicMaterial color="#3ECF8E" transparent opacity={0.05} />
    </lineSegments>
  )
}

// Floating glitch particles
function GlitchParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, colors } = useMemo(() => {
    const count = 50
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5
      
      // Supabase green with occasional other colors
      if (Math.random() > 0.8) {
        colors[i * 3] = 0 // R
        colors[i * 3 + 1] = 0.96 // G  
        colors[i * 3 + 2] = 1 // B (cyan)
      } else {
        colors[i * 3] = 0.24 // R
        colors[i * 3 + 1] = 0.81 // G
        colors[i * 3 + 2] = 0.56 // B (supabase green)
      }
    }
    
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        // Glitch-style movement
        positions[i] += (Math.random() - 0.5) * 0.02
        positions[i + 1] += (Math.random() - 0.5) * 0.02
        
        // Wrap around
        if (positions[i] > 15) positions[i] = -15
        if (positions[i] < -15) positions[i] = 15
        if (positions[i + 1] > 15) positions[i + 1] = -15
        if (positions[i + 1] < -15) positions[i + 1] = 15
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        vertexColors 
        transparent 
        opacity={0.6}
        sizeAttenuation={false}
      />
    </points>
  )
}

export default function PulsingGrid() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-neural-blue/50 to-slate-900/50" />
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        className="w-full h-full"
      >
        {/* Lighting setup for 3D blocks */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.6} 
          color="#ffffff" 
        />
        <pointLight 
          position={[-5, -5, 3]} 
          intensity={0.4} 
          color="#3ECF8E" 
        />
        
        {/* Tetris-inspired components */}
        <TetrisGridLines />
        <TetrisGrid />
        <GlitchParticles />
        
        {/* Atmospheric fog */}
        <fog attach="fog" args={['#0B1426', 8, 30]} />
      </Canvas>
    </div>
  )
}