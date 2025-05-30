import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

function CTASection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-amber-900 to-yellow-900">
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-5xl font-bold text-white mb-6">
          Prêt pour l'Aventure ?
        </h2>
        <p className="text-xl text-amber-200 mb-10">
          Rejoignez des milliers de héros et commencez votre épopée dès aujourd'hui
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-white text-amber-900 font-bold rounded-full text-lg shadow-2xl"
          >
            Créer un Compte Gratuit
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-transparent text-white font-bold rounded-full text-lg border-2 border-white hover:bg-white/10"
          >
            En Savoir Plus
          </motion.button>
        </div>
        
        <p className="mt-8 text-amber-200">
          ✨ Aucune carte de crédit requise • 🎮 3 aventures gratuites incluses
        </p>
      </motion.div>
    </section>
  )
}

export default CTASection