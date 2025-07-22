'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Pixelated conveyor belt component
function ConveyorBelt() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const conveyorTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    
    // Create pixelated conveyor pattern
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, 0, 64, 64)
    
    // Add conveyor lines
    ctx.fillStyle = '#444'
    for (let i = 0; i < 8; i++) {
      ctx.fillRect(0, i * 8, 64, 2)
    }
    
    // Add moving elements
    ctx.fillStyle = '#00F5FF'
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(i * 16 + 4, 28, 8, 8)
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  useFrame((state) => {
    if (meshRef.current && conveyorTexture) {
      conveyorTexture.offset.x += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 8]} />
      <meshBasicMaterial map={conveyorTexture} />
    </mesh>
  )
}

// Pixelated robot arm
function RobotArm({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  
  const pixelMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ 
      color: '#888888',
      transparent: true,
      opacity: 0.9
    })
  }, [])

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ 
      color: '#00F5FF',
      transparent: true,
      opacity: 0.7
    })
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Base */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[1, 0.5, 1]} />
        <primitive object={pixelMaterial} />
      </mesh>
      
      {/* Arm segments */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 2, 0.3]} />
        <primitive object={pixelMaterial} />
      </mesh>
      
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.3]} />
        <primitive object={pixelMaterial} />
      </mesh>
      
      {/* Glowing end effector */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <primitive object={glowMaterial} />
      </mesh>
      
      {/* Neon glow effect */}
      <pointLight position={[0, 2, 0]} color="#00F5FF" intensity={2} distance={5} />
    </group>
  )
}

// Moving MVP components on the belt
function MVPComponents() {
  const groupRef = useRef<THREE.Group>(null)
  
  const componentPositions = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => [
      (i - 3) * 3,
      -1.5,
      Math.sin(i) * 0.5
    ] as [number, number, number])
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.x += 0.02
        if (child.position.x > 10) {
          child.position.x = -10
        }
        child.rotation.y += 0.05
      })
    }
  })

  return (
    <group ref={groupRef}>
      {componentPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial 
            color={i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#FF6B35' : '#4ECDC4'} 
          />
        </mesh>
      ))}
    </group>
  )
}

// Particle system for sparks and effects
function FactoryParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, colors } = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = Math.random() * 5 - 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      // Electric cyan or orange sparks
      if (Math.random() > 0.5) {
        colors[i * 3] = 0 // R
        colors[i * 3 + 1] = 0.96 // G  
        colors[i * 3 + 2] = 1 // B (cyan)
      } else {
        colors[i * 3] = 1 // R
        colors[i * 3 + 1] = 0.42 // G
        colors[i * 3 + 2] = 0.21 // B (orange)
      }
    }
    
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01
        
        if (positions[i + 1] > 3) {
          positions[i + 1] = -2
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.rotation.y += 0.002
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
        size={0.05} 
        vertexColors 
        transparent 
        opacity={0.8}
        sizeAttenuation={false}
      />
    </points>
  )
}

// Factory backdrop with neon grid
function FactoryBackdrop() {
  const gridRef = useRef<THREE.LineSegments>(null)
  
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    
    // Create a retro grid pattern
    for (let i = -10; i <= 10; i++) {
      vertices.push(-10, 0, i, 10, 0, i) // Horizontal lines
      vertices.push(i, 0, -10, i, 0, 10) // Vertical lines
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geometry
  }, [])

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <lineSegments ref={gridRef} position={[0, -3, 0]}>
      <primitive object={gridGeometry} />
      <lineBasicMaterial color="#00F5FF" transparent opacity={0.3} />
    </lineSegments>
  )
}

export default function RetroAssemblyLine() {
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
        camera={{ position: [0, 2, 8], fov: 60 }}
        className="w-full h-full"
        style={{ background: 'linear-gradient(180deg, #0B1426 0%, #1a1a2e 50%, #16213e 100%)' }}
      >
        {/* Ambient lighting for retro feel */}
        <ambientLight intensity={0.4} color="#4a00e0" />
        
        {/* Main factory lighting */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          color="#00F5FF" 
        />
        
        {/* Accent lighting */}
        <pointLight 
          position={[-5, 3, 2]} 
          intensity={1} 
          color="#FF6B35" 
          distance={10}
        />
        
        {/* Factory components */}
        <FactoryBackdrop />
        <ConveyorBelt />
        <MVPComponents />
        <RobotArm position={[-3, 1, 0]} />
        <RobotArm position={[3, 1, 1]} />
        <FactoryParticles />
        
        {/* Retro scan lines effect */}
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[50, 30]} />
          <meshBasicMaterial 
            transparent 
            opacity={0.05} 
            color="#00F5FF"
          />
        </mesh>
      </Canvas>
    </div>
  )
}