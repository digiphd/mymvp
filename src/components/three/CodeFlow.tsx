'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Individual code stream/line
function CodeStream({ start, end, delay, speed }: {
  start: [number, number, number]
  end: [number, number, number]
  delay: number
  speed: number
}) {
  const lineRef = useRef<THREE.Line>(null)
  const [progress, setProgress] = useState(0)
  
  const geometry = useMemo(() => {
    const points = []
    const segments = 50
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = start[0] + (end[0] - start[0]) * t
      const y = start[1] + (end[1] - start[1]) * t
      const z = start[2] + (end[2] - start[2]) * t
      points.push(new THREE.Vector3(x, y, z))
    }
    
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [start, end])

  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime * speed + delay
      const newProgress = (Math.sin(time) * 0.5 + 0.5)
      setProgress(newProgress)
      
      // Update opacity based on progress
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.1 + newProgress * 0.4
    }
  })

  return (
    <line ref={lineRef}>
      <primitive object={geometry} />
      <lineBasicMaterial 
        color="#3ECF8E" 
        transparent 
        opacity={0.2}
      />
    </line>
  )
}

// Flowing data packets along streams
function DataPacket({ path, delay, speed }: {
  path: [number, number, number][]
  delay: number
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && path.length > 1) {
      const time = (state.clock.elapsedTime * speed + delay) % 1
      const segmentIndex = Math.floor(time * (path.length - 1))
      const segmentProgress = (time * (path.length - 1)) % 1
      
      if (segmentIndex < path.length - 1) {
        const start = path[segmentIndex]
        const end = path[segmentIndex + 1]
        
        meshRef.current.position.x = start[0] + (end[0] - start[0]) * segmentProgress
        meshRef.current.position.y = start[1] + (end[1] - start[1]) * segmentProgress
        meshRef.current.position.z = start[2] + (end[2] - start[2]) * segmentProgress
        
        // Fade effect
        const material = meshRef.current.material as THREE.MeshBasicMaterial
        material.opacity = Math.sin(time * Math.PI) * 0.8
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial 
        color="#3ECF8E" 
        transparent 
        opacity={0.6}
      />
    </mesh>
  )
}

// Code nodes that represent different parts of the development pipeline
function CodeNode({ position, label, active }: {
  position: [number, number, number]
  label: string
  active: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      if (active) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1
        groupRef.current.scale.setScalar(pulse)
      } else {
        groupRef.current.scale.setScalar(1)
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Node core */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={active ? "#3ECF8E" : "#666666"}
          emissive={active ? "#3ECF8E" : "#000000"}
          emissiveIntensity={active ? 0.2 : 0}
          transparent
          opacity={active ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* Node ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 16]} />
        <meshBasicMaterial 
          color="#3ECF8E" 
          transparent 
          opacity={active ? 0.4 : 0.1}
        />
      </mesh>
    </group>
  )
}

// Main code flow visualization
function CodeFlowSystem() {
  const [activeNodes, setActiveNodes] = useState<number[]>([])
  
  // Define the development pipeline nodes
  const nodes = useMemo(() => [
    { position: [-8, 4, 0] as [number, number, number], label: "AI Analysis" },
    { position: [-4, 2, 0] as [number, number, number], label: "Architecture" },
    { position: [0, 0, 0] as [number, number, number], label: "Core Logic" },
    { position: [4, 2, 0] as [number, number, number], label: "API Layer" },
    { position: [8, 4, 0] as [number, number, number], label: "Deployment" },
    { position: [-6, -3, 0] as [number, number, number], label: "Database" },
    { position: [0, -4, 0] as [number, number, number], label: "Auth System" },
    { position: [6, -3, 0] as [number, number, number], label: "Frontend" },
  ], [])

  // Define connections between nodes
  const connections = useMemo(() => [
    { start: nodes[0].position, end: nodes[1].position },
    { start: nodes[1].position, end: nodes[2].position },
    { start: nodes[2].position, end: nodes[3].position },
    { start: nodes[3].position, end: nodes[4].position },
    { start: nodes[5].position, end: nodes[2].position },
    { start: nodes[2].position, end: nodes[6].position },
    { start: nodes[2].position, end: nodes[7].position },
    { start: nodes[6].position, end: nodes[7].position },
  ], [nodes])

  // Simulate active nodes in sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodes(prev => {
        const next = [...prev]
        if (next.length >= 3) {
          next.shift() // Remove oldest
        }
        next.push(Math.floor(Math.random() * nodes.length))
        return next
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [nodes.length])

  return (
    <group>
      {/* Render nodes */}
      {nodes.map((node, index) => (
        <CodeNode
          key={index}
          position={node.position}
          label={node.label}
          active={activeNodes.includes(index)}
        />
      ))}
      
      {/* Render connections */}
      {connections.map((connection, index) => (
        <CodeStream
          key={index}
          start={connection.start}
          end={connection.end}
          delay={index * 0.5}
          speed={0.5}
        />
      ))}
      
      {/* Render data packets */}
      {connections.map((connection, index) => (
        <DataPacket
          key={`packet-${index}`}
          path={[connection.start, connection.end]}
          delay={index * 0.8}
          speed={0.3}
        />
      ))}
    </group>
  )
}

// Subtle background code particles
function CodeParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, colors } = useMemo(() => {
    const count = 100
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      
      // Mostly supabase green with some variety
      colors[i * 3] = 0.24     // R
      colors[i * 3 + 1] = 0.81 // G
      colors[i * 3 + 2] = 0.56 // B
    }
    
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + positions[i]) * 0.005
        
        // Gentle floating motion
        if (positions[i + 1] > 8) positions[i + 1] = -8
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      
      // Subtle opacity pulse
      const material = pointsRef.current.material as THREE.PointsMaterial
      material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
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
        size={0.02} 
        vertexColors 
        transparent 
        opacity={0.15}
        sizeAttenuation={false}
      />
    </points>
  )
}

export default function CodeFlow() {
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
        camera={{ position: [0, 0, 15], fov: 50 }}
        className="w-full h-full"
      >
        {/* Professional lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.3} 
          color="#ffffff" 
        />
        <pointLight 
          position={[0, 0, 5]} 
          intensity={0.4} 
          color="#3ECF8E" 
        />
        
        {/* Code flow system */}
        <CodeFlowSystem />
        <CodeParticles />
        
        {/* Subtle atmospheric fog */}
        <fog attach="fog" args={['#0B1426', 10, 35]} />
      </Canvas>
    </div>
  )
}