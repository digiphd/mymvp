'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Individual network node that can be attracted to cursor
function NetworkNode({ position, index, mousePosition }: {
  position: [number, number, number]
  index: number
  mousePosition: THREE.Vector3
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const originalPosition = useRef(new THREE.Vector3(...position))
  
  useFrame((state) => {
    if (meshRef.current) {
      const nodePos = meshRef.current.position
      const originalPos = originalPosition.current
      
      // Calculate distance to mouse
      const distance = mousePosition.distanceTo(nodePos)
      const maxDistance = 5
      
      if (distance < maxDistance) {
        // Attract to mouse with falloff
        const attraction = Math.pow(1 - (distance / maxDistance), 2)
        const direction = mousePosition.clone().sub(nodePos).normalize()
        const force = direction.multiplyScalar(attraction * 0.05)
        
        nodePos.add(force)
        
        // Glow effect when near cursor
        const material = meshRef.current.material as THREE.MeshStandardMaterial
        material.emissiveIntensity = 0.2 + attraction * 0.6
        material.opacity = 0.6 + attraction * 0.4
      } else {
        // Slowly return to original position
        const returnForce = originalPos.clone().sub(nodePos).multiplyScalar(0.02)
        nodePos.add(returnForce)
        
        const material = meshRef.current.material as THREE.MeshStandardMaterial
        material.emissiveIntensity = 0.1
        material.opacity = 0.6
      }
      
      // Add gentle floating motion
      const floatX = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.02
      const floatY = Math.cos(state.clock.elapsedTime * 0.2 + index) * 0.02
      nodePos.x += floatX * 0.1
      nodePos.y += floatY * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial 
        color="#3ECF8E"
        emissive="#3ECF8E"
        emissiveIntensity={0.1}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// Dynamic connections between nodes
function NetworkConnections({ nodes }: { nodes: THREE.Object3D[] }) {
  const linesRef = useRef<THREE.LineSegments>(null)
  
  useFrame(() => {
    if (linesRef.current && nodes.length > 0) {
      const positions = []
      const colors = []
      
      // Connect nodes that are close to each other
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i]
          const nodeB = nodes[j]
          
          if (nodeA.position && nodeB.position) {
            const distance = nodeA.position.distanceTo(nodeB.position)
            const maxConnectionDistance = 6
            
            if (distance < maxConnectionDistance) {
              // Add line
              positions.push(nodeA.position.x, nodeA.position.y, nodeA.position.z)
              positions.push(nodeB.position.x, nodeB.position.y, nodeB.position.z)
              
              // Color based on distance (closer = brighter)
              const intensity = 1 - (distance / maxConnectionDistance)
              colors.push(0.24 * intensity, 0.81 * intensity, 0.56 * intensity) // Start point
              colors.push(0.24 * intensity, 0.81 * intensity, 0.56 * intensity) // End point
            }
          }
        }
      }
      
      // Update geometry
      linesRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      )
      linesRef.current.geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
      )
    }
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry />
      <lineBasicMaterial vertexColors transparent opacity={0.6} />
    </lineSegments>
  )
}

// Mouse tracking and 3D conversion
function MouseTracker({ onMouseMove }: { onMouseMove: (position: THREE.Vector3) => void }) {
  const { camera, gl, size } = useThree()
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Get mouse position relative to canvas
      const rect = gl.domElement.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // Convert to 3D world coordinates on z=0 plane
      const mouse3D = new THREE.Vector3(x, y, 0)
      mouse3D.unproject(camera)
      
      // Scale to reasonable world coordinates
      mouse3D.x *= 10
      mouse3D.y *= 6
      mouse3D.z = 0
      
      onMouseMove(mouse3D)
    }

    const canvas = gl.domElement
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', () => {
      // Reset mouse position when leaving canvas
      onMouseMove(new THREE.Vector3(0, 0, -20))
    })
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', () => {})
    }
  }, [camera, gl.domElement, onMouseMove])

  return null
}

// Main interactive network
function InteractiveNetworkSystem() {
  const groupRef = useRef<THREE.Group>(null)
  const [mousePosition, setMousePosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, -20))
  const [nodes, setNodes] = useState<THREE.Object3D[]>([])
  
  // Generate node positions
  const nodePositions = useMemo(() => {
    const positions: [number, number, number][] = []
    const count = 30
    
    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6
      ])
    }
    
    return positions
  }, [])

  // Update nodes array when group changes
  useEffect(() => {
    if (groupRef.current) {
      setNodes(Array.from(groupRef.current.children))
    }
  }, [nodePositions])

  const handleMouseMove = (position: THREE.Vector3) => {
    setMousePosition(position)
  }

  return (
    <group>
      <MouseTracker onMouseMove={handleMouseMove} />
      
      <group ref={groupRef}>
        {nodePositions.map((position, index) => (
          <NetworkNode
            key={index}
            position={position}
            index={index}
            mousePosition={mousePosition}
          />
        ))}
      </group>
      
      <NetworkConnections nodes={nodes} />
    </group>
  )
}

// Floating data streams in the background
function DataStreams() {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, colors } = useMemo(() => {
    const count = 150
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
      
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
        // Gentle flowing motion
        positions[i] += Math.sin(state.clock.elapsedTime * 0.5 + positions[i + 1]) * 0.01
        positions[i + 1] += Math.cos(state.clock.elapsedTime * 0.3 + positions[i]) * 0.005
        positions[i + 2] += Math.sin(state.clock.elapsedTime * 0.2 + positions[i]) * 0.008
        
        // Wrap around
        if (positions[i] > 15) positions[i] = -15
        if (positions[i] < -15) positions[i] = 15
        if (positions[i + 1] > 10) positions[i + 1] = -10
        if (positions[i + 1] < -10) positions[i + 1] = 10
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
        size={0.015} 
        vertexColors 
        transparent 
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  )
}

export default function InteractiveNetwork() {
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
        {/* Enhanced lighting for 3D effect */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.6} 
          color="#ffffff" 
        />
        <pointLight 
          position={[-5, -5, 5]} 
          intensity={0.8} 
          color="#3ECF8E" 
        />
        <pointLight 
          position={[5, 5, -5]} 
          intensity={0.4} 
          color="#ffffff" 
        />
        
        {/* Interactive network system */}
        <InteractiveNetworkSystem />
        <DataStreams />
        
        {/* Atmospheric fog for depth */}
        <fog attach="fog" args={['#0B1426', 8, 25]} />
      </Canvas>
    </div>
  )
}