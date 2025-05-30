import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Book3D from '../three/Book3D'

function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900">
      {/* Livre 3D en arrière-plan */}
      <div className="absolute inset-0 opacity-60">
        <Book3D />
      </div>
      
      {/* Overlay gradient pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-transparent to-orange-900/60" />
      
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto"
           style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
            VEH
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-3xl text-yellow-200 mb-4 font-light"
        >
          Votre Épopée Héroïque
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-amber-200 mb-12 max-w-2xl mx-auto"
        >
          Créez et vivez des aventures interactives où chaque choix façonne votre destinée. 
          Inspiré des livres dont vous êtes le héros, réinventé pour l'ère numérique.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-yellow-700 to-amber-700 text-white font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-600/50">
            Commencer l'Aventure
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/30 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
            Découvrir le Concept
          </button>
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}

export default HeroSection