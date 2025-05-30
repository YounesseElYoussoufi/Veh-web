import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Composant pour les chemins d'aventure
function AdventurePathField() {
  const groupRef = useRef()
  const pathsRef = useRef()
  const nodesRef = useRef()
  const heroesRef = useRef([])
  const actorsRef = useRef([])
  
  // Création des chemins façon "livre dont vous êtes le héros"
  const pathData = useMemo(() => {
    const paths = []
    const nodes = []
    
    // Générer des nœuds de décision avec plus d'espacement
    for (let i = 0; i < 12; i++) {
      nodes.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6
        ),
        connections: [],
        type: Math.random() > 0.6 ? 'major' : 'minor'
      })
    }
    
    // Connecter les nœuds pour créer des chemins plus visibles
    nodes.forEach((node, i) => {
      const numConnections = Math.floor(Math.random() * 2) + 1
      for (let j = 0; j < numConnections; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length)
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex)
          
          // Créer une courbe plus douce entre les nœuds
          const midPoint1 = new THREE.Vector3(
            (node.position.x + nodes[targetIndex].position.x) / 2 + (Math.random() - 0.5) * 3,
            (node.position.y + nodes[targetIndex].position.y) / 2 + (Math.random() - 0.5) * 3,
            (node.position.z + nodes[targetIndex].position.z) / 2 + (Math.random() - 0.5) * 2
          )
          
          const curve = new THREE.CubicBezierCurve3(
            node.position,
            midPoint1,
            midPoint1.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 0)),
            nodes[targetIndex].position
          )
          
          paths.push({
            curve: curve,
            points: curve.getPoints(80),
            progress: Math.random(),
            width: Math.random() > 0.7 ? 0.08 : 0.04
          })
        }
      }
    })
    
    return { paths, nodes }
  }, [])

  // Données des héros avec des propriétés améliorées
  const heroesData = useMemo(() => {
    const heroTypes = [
      { name: 'Guerrier', color: '#dc2626', secondaryColor: '#991b1b' },
      { name: 'Mage', color: '#2563eb', secondaryColor: '#1d4ed8' },
      { name: 'Archer', color: '#16a34a', secondaryColor: '#15803d' },
      { name: 'Paladin', color: '#ca8a04', secondaryColor: '#a16207' },
      { name: 'Assassin', color: '#7c3aed', secondaryColor: '#6d28d9' }
    ]
    
    return Array(5).fill(null).map((_, i) => ({
      id: i,
      ...heroTypes[i],
      pathIndex: Math.floor(Math.random() * pathData.paths.length),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.002,
      size: 0.4 + Math.random() * 0.2,
      weapon: i % 3 === 0 ? 'sword' : i % 3 === 1 ? 'staff' : 'bow'
    }))
  }, [pathData])

  // Données des acteurs secondaires améliorées
  const actorsData = useMemo(() => {
    return Array(15).fill(null).map((_, i) => ({
      id: i,
      pathIndex: Math.floor(Math.random() * pathData.paths.length),
      progress: Math.random(),
      speed: 0.001 + Math.random() * 0.001,
      color: ['#fbbf24', '#f59e0b', '#d97706'][i % 3],
      size: 0.12 + Math.random() * 0.08
    }))
  }, [pathData])

  useFrame((state) => {
    if (groupRef.current) {
      // Rotation plus lente pour mieux observer
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3
      
      // Animation des héros avec mouvements plus fluides
      heroesRef.current.forEach((heroGroup, index) => {
        if (heroGroup && heroesData[index]) {
          const data = heroesData[index]
          data.progress = (data.progress + data.speed) % 1
          
          const path = pathData.paths[data.pathIndex]
          if (path) {
            const point = path.curve.getPoint(data.progress)
            
            heroGroup.position.set(point.x, point.y, point.z)
            
            // Effet de pulsation pour les héros plus prononcé
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.15
            heroGroup.scale.setScalar(scale)
            
            // Rotation du héros vers la direction du mouvement
            const nextPoint = path.curve.getPoint((data.progress + 0.01) % 1)
            const direction = new THREE.Vector3().subVectors(nextPoint, point).normalize()
            heroGroup.lookAt(heroGroup.position.clone().add(direction))
            
            // Mouvement vertical pour simuler la marche
            heroGroup.position.y += Math.sin(state.clock.elapsedTime * 8 + index * 2) * 0.03
          }
        }
      })
      
      // Animation des acteurs avec mouvements subtils
      actorsRef.current.forEach((actor, index) => {
        if (actor && actorsData[index]) {
          const data = actorsData[index]
          data.progress = (data.progress + data.speed) % 1
          
          const path = pathData.paths[data.pathIndex]
          if (path) {
            const point = path.curve.getPoint(data.progress)
            actor.position.set(point.x, point.y, point.z)
            
            // Mouvement de flottement pour les acteurs
            actor.position.y += Math.sin(state.clock.elapsedTime * 3 + index * 0.8) * 0.02
            actor.rotation.y = state.clock.elapsedTime + index
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Éclairage amélioré pour les héros */}
      <ambientLight intensity={0.4} color="#fbbf24" />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={0.8} 
        color="#ffffff"
        castShadow
      />
      <pointLight 
        position={[0, 5, 0]} 
        intensity={0.6} 
        color="#f59e0b"
        distance={20}
        decay={2}
      />

      {/* Chemins d'aventure améliorés */}
      <group ref={pathsRef}>
        {pathData.paths.map((path, index) => (
          <mesh key={index}>
            <tubeGeometry 
              args={[path.curve, 80, path.width, 8, false]} 
            />
            <meshStandardMaterial 
              color={new THREE.Color().setHSL(0.1 + index * 0.05, 0.7, 0.4)} 
              opacity={0.6}
              transparent
              emissive={new THREE.Color().setHSL(0.1 + index * 0.05, 0.5, 0.1)}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Nœuds de décision plus visibles */}
      <group ref={nodesRef}>
        {pathData.nodes.map((node, index) => (
          <group key={index} position={node.position}>
            <mesh>
              <sphereGeometry args={[node.type === 'major' ? 0.25 : 0.15, 16, 16]} />
              <meshStandardMaterial 
                color={node.type === 'major' ? '#dc2626' : '#f59e0b'}
                emissive={node.type === 'major' ? '#dc2626' : '#f59e0b'}
                emissiveIntensity={0.6}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            {/* Anneaux décoratifs animés */}
            {node.type === 'major' && (
              <>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.4, 0.03, 8, 32]} />
                  <meshStandardMaterial 
                    color="#fbbf24"
                    emissive="#fbbf24"
                    emissiveIntensity={0.5}
                  />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <torusGeometry args={[0.35, 0.02, 6, 24]} />
                  <meshStandardMaterial 
                    color="#f59e0b"
                    emissive="#f59e0b"
                    emissiveIntensity={0.4}
                  />
                </mesh>
              </>
            )}
          </group>
        ))}
      </group>

      {/* Héros principaux 3D améliorés */}
      <group>
        {heroesData.map((hero, index) => (
          <HeroCharacter 
            key={hero.id} 
            ref={el => heroesRef.current[index] = el}
            hero={hero}
            index={index}
          />
        ))}
      </group>

      {/* Acteurs secondaires simplifiés */}
      <group>
        {actorsData.map((actor, index) => (
          <mesh 
            key={actor.id} 
            ref={el => actorsRef.current[index] = el}
          >
            <octahedronGeometry args={[actor.size, 1]} />
            <meshStandardMaterial 
              color={actor.color}
              emissive={actor.color}
              emissiveIntensity={0.3}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Pages flottantes */}
      <PagesParticles />
      
      {/* Effets de lumière */}
      <MagicalGlow />
      
      {/* Étoiles de quête */}
      <QuestStars />
    </group>
  )
}

// Composant héros 3D détaillé
const HeroCharacter = React.forwardRef(({ hero, index }, ref) => {
  const heroGroupRef = useRef()
  
  useFrame((state) => {
    if (heroGroupRef.current) {
      // Animation de respiration
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 4 + index) * 0.05
      heroGroupRef.current.children[0].scale.y = breathe
      
      // Animation de l'arme
      if (heroGroupRef.current.children[3]) {
        heroGroupRef.current.children[3].rotation.z = Math.sin(state.clock.elapsedTime * 2 + index) * 0.1
      }
    }
  })
  
  return (
    <group ref={(el) => { heroGroupRef.current = el; if (ref) ref.current = el; }}>
      {/* Corps principal du héros */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[hero.size * 0.3, hero.size * 0.8, 4, 8]} />
        <meshStandardMaterial 
          color={hero.color}
          emissive={hero.color}
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      
      {/* Tête du héros */}
      <mesh position={[0, hero.size * 0.7, 0]}>
        <sphereGeometry args={[hero.size * 0.25, 12, 12]} />
        <meshStandardMaterial 
          color={hero.secondaryColor}
          emissive={hero.secondaryColor}
          emissiveIntensity={0.2}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Aura magique du héros */}
      <mesh>
        <sphereGeometry args={[hero.size * 1.8, 16, 16]} />
        <meshStandardMaterial 
          color={hero.color}
          emissive={hero.color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Arme selon le type de héros */}
      {hero.weapon === 'sword' && (
        <mesh position={[hero.size * 0.4, hero.size * 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[hero.size * 0.05, hero.size * 0.8, hero.size * 0.05]} />
          <meshStandardMaterial 
            color="#c0c0c0"
            metalness={0.9}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      )}
      
      {hero.weapon === 'staff' && (
        <group position={[hero.size * -0.3, hero.size * 0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[hero.size * 0.03, hero.size * 0.03, hero.size * 1.2, 8]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, hero.size * 0.6, 0]}>
            <sphereGeometry args={[hero.size * 0.1, 8, 8]} />
            <meshStandardMaterial 
              color="#4f46e5"
              emissive="#4f46e5"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      )}
      
      {hero.weapon === 'bow' && (
        <mesh position={[hero.size * -0.4, hero.size * 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[hero.size * 0.3, hero.size * 0.02, 4, 16, Math.PI]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      )}
      
      {/* Cape flottante */}
      <mesh position={[0, hero.size * 0.1, hero.size * -0.3]} rotation={[0.2, 0, 0]}>
        <planeGeometry args={[hero.size * 0.8, hero.size * 1.0]} />
        <meshStandardMaterial 
          color={hero.secondaryColor}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Particules d'énergie autour du héros */}
      <EnergyParticles color={hero.color} size={hero.size} />
    </group>
  )
})

// Composant pour les particules d'énergie autour des héros
function EnergyParticles({ color, size }) {
  const particlesRef = useRef()
  const count = 8
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = size * 1.5
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = (Math.random() - 0.5) * size * 2
      pos[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pos
  }, [size])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 2
      
      // Animation des particules
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 3 + i) * 0.01
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Composant pour les pages flottantes
function PagesParticles() {
  const pagesRef = useRef()
  const count = 30
  
  const [positions, rotations] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const rotations = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12
      
      rotations[i * 3] = Math.random() * Math.PI * 2
      rotations[i * 3 + 1] = Math.random() * Math.PI * 2
      rotations[i * 3 + 2] = Math.random() * Math.PI * 2
    }
    
    return [positions, rotations]
  }, [])
  
  useFrame((state) => {
    if (pagesRef.current) {
      const time = state.clock.elapsedTime
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        pagesRef.current.children[i].rotation.x = rotations[i3] + time * 0.2
        pagesRef.current.children[i].rotation.y = rotations[i3 + 1] + time * 0.3
        pagesRef.current.children[i].rotation.z = rotations[i3 + 2] + time * 0.1
        
        pagesRef.current.children[i].position.y += Math.sin(time * 0.5 + i) * 0.002
      }
    }
  })
  
  return (
    <group ref={pagesRef}>
      {[...Array(count)].map((_, i) => (
        <mesh
          key={i}
          position={[
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2]
          ]}
        >
          <planeGeometry args={[0.15, 0.2]} />
          <meshStandardMaterial 
            color="#f4e8d0"
            emissive="#d97706"
            emissiveIntensity={0.05}
            side={THREE.DoubleSide}
            opacity={0.4}
            transparent
          />
        </mesh>
      ))}
    </group>
  )
}

// Effet de lueur magique
function MagicalGlow() {
  const glowRef = useRef()
  
  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 
        0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2
      glowRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[12, 32, 32]} />
      <meshStandardMaterial
        color="#d97706"
        emissive="#f59e0b"
        emissiveIntensity={0.3}
        transparent
        opacity={0.03}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// Étoiles de quête flottantes
function QuestStars() {
  const starsRef = useRef()
  const count = 20
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])
  
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.05
      
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3
      starsRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffd700"
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default AdventurePathField