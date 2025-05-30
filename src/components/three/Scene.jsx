import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import AnimatedBook from './Book3D'
import MagicParticles from './ParticleField'

function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={0.5} />
        
        <Suspense fallback={null}>
          <AnimatedBook position={[-3, 0, 0]} rotation={[0, 0.5, 0]} />
          <AnimatedBook position={[3, 0, 0]} rotation={[0, -0.5, 0]} />
          <AnimatedBook position={[0, 0, -2]} rotation={[0, 0, 0]} />
          <MagicParticles />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}

export default Scene3D