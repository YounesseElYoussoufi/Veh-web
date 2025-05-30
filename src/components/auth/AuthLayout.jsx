import React, { Suspense, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import AdventurePathField from '../three/AdventurePathField'

// Composant de particules flottantes CSS pour le fallback
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i)
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-amber-300 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Composant de grille animée style parchemin
const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 opacity-10">
      <motion.div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 69, 19, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ['0 0', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

// Composant d'orbes lumineux flottants dorés
const GlowingOrbs = () => {
  const orbs = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: Math.random() * 200 + 100,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, rgba(217, 119, 6, 0.3) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 100%)`
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.2, 0.3]
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Composant de lignes de chemin animées
const AdventureLines = () => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
      {[...Array(3)].map((_, i) => (
        <motion.path
          key={i}
          d={`M ${Math.random() * 100}% ${100}% Q ${Math.random() * 100}% ${Math.random() * 100}% ${Math.random() * 100}% ${0}%`}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 5,
            delay: i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function AuthLayout({ children }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    setIsLoaded(true)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-amber-950 via-yellow-900 to-orange-950 flex flex-col relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Couche de fond dynamique avec effet de parallaxe */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-yellow-800/30 to-orange-900/20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(180, 83, 9, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(146, 64, 14, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(180, 83, 9, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(217, 119, 6, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(146, 64, 14, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(180, 83, 9, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(146, 64, 14, 0.3) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Texture parchemin en overlay */}
      <div className="absolute inset-0 opacity-30 mix-blend-multiply">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 69, 19, 0.1) 35px, rgba(139, 69, 19, 0.1) 70px)`,
        }} />
      </div>

      {/* Grille animée */}
      <AnimatedGrid />

      {/* Lignes de chemin d'aventure */}
      <AdventureLines />

      {/* Orbes lumineux */}
      <GlowingOrbs />

      {/* Effet de curseur interactif */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x * 50 + 50}% ${mousePosition.y * 50 + 50}%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)`
        }}
      />

      {/* 3D Background avec chemins d'aventure */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={<FloatingParticles />}>
            <AdventurePathField />
            <ambientLight intensity={0.5} color="#f59e0b" />
            <pointLight position={[10, 10, 10]} intensity={0.3} color="#d97706" />
          </Suspense>
        </Canvas>
        {/* Fallback CSS particles si Three.js échoue */}
        <FloatingParticles />
      </div>
      
      {/* Header avec glassmorphism */}
      <motion.header 
        className="relative z-10 p-6"
        variants={itemVariants}
      >
        <Link to="/" className="inline-flex items-center group">
          <motion.div 
            whileHover={{ 
              scale: 1.05,
              filter: "drop-shadow(0 0 20px rgba(245, 158, 11, 0.5))"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.div
              className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              VEH
            </motion.div>
            
            {/* Effet de lueur au survol */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/20 to-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </Link>
      </motion.header>

      {/* Main Content avec glassmorphism style parchemin */}
      <motion.main 
        className="flex-1 flex items-center justify-center p-6 relative z-10"
        variants={itemVariants}
      >
        <motion.div 
          className="w-full max-w-md relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Backdrop glassmorphism pour le contenu */}
          <div className="absolute inset-0 bg-amber-50/5 backdrop-blur-xl rounded-2xl border border-amber-200/10 shadow-2xl" />
          
          {/* Effet de bordure animée dorée */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(45deg, transparent, rgba(245, 158, 11, 0.5), transparent)",
              padding: "1px"
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full bg-amber-950/20 rounded-2xl" />
          </motion.div>
          
          {/* Coins décoratifs style livre ancien */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400/50 rounded-br-lg" />
          
          <div className="relative z-10 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.main>

      {/* Footer amélioré */}
      <motion.footer 
        className="relative z-10 p-6 text-center"
        variants={itemVariants}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p className="text-amber-200/80 text-sm font-light tracking-wide">
            © 2024 VEH - Votre Épopée Héroïque
          </p>
          <motion.div 
            className="mt-2 w-32 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
        </motion.div>
      </motion.footer>

      {/* Particules de décoration supplémentaires style étincelles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default AuthLayout