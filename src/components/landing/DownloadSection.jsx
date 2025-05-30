import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

function DownloadSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="download" className="py-20 px-6 bg-gradient-to-br from-slate-900 via-amber-900 to-yellow-800 relative overflow-hidden">
      {/* Éléments de décoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-yellow-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Téléchargez l'App
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              VEH
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-amber-200 max-w-3xl mx-auto leading-relaxed">
            Vivez vos aventures partout avec vous. Jouez aux scénarios créés par la communauté où que vous soyez.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Côté gauche - Mockup mobile */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative mx-auto w-80 h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-2 shadow-2xl">
              {/* Écran du téléphone */}
              <div className="w-full h-full bg-gradient-to-br from-amber-900 to-yellow-900 rounded-2xl overflow-hidden relative">
                {/* Barre de statut */}
                <div className="h-8 bg-black/20 flex items-center justify-between px-4 text-white text-xs">
                  <span>9:41</span>
                  <div className="flex space-x-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>
                
                {/* Contenu de l'app */}
                <div className="p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">VEH</div>
                  <div className="text-amber-200 text-sm mb-4">Votre Épopée Héroïque</div>
                  
                  {/* Simulation d'une histoire */}
                  <div className="bg-white/10 rounded-lg p-4 mb-4 text-left">
                    <div className="text-yellow-300 font-semibold text-sm mb-2">Le Mystère de la Tour</div>
                    <div className="text-white text-xs leading-relaxed">
                      Vous approchez de la tour mystérieuse...
                    </div>
                  </div>
                  
                  {/* Boutons de choix simulés */}
                  <div className="space-y-2">
                    <div className="bg-yellow-700 rounded-lg p-2 text-white text-xs">1. Entrer prudemment</div>
                    <div className="bg-white/10 rounded-lg p-2 text-white text-xs">2. Faire le tour</div>
                  </div>
                </div>
              </div>
              
              {/* Bouton home */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white rounded-full"></div>
            </div>
          </motion.div>

          {/* Côté droit - Boutons de téléchargement */}
          <motion.div variants={itemVariants} className="space-y-8">
              <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold text-white mb-4">
                L'aventure dans votre poche
              </h3>
              <p className="text-amber-200 text-lg mb-8">
                Jouez à vos aventures favorites n'importe où. L'app mobile vous permet de vivre vos histoires interactives en déplacement.
              </p>
            </div>

            {/* Boutons de téléchargement */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* App Store */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-black text-white px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-2xl">🍎</div>
                <div className="text-left">
                  <div className="text-xs opacity-80">Télécharger sur</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </motion.button>

              {/* Google Play */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-2xl">📱</div>
                <div className="text-left">
                  <div className="text-xs opacity-80">Disponible sur</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </motion.button>
            </div>

            {/* Statistiques */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">50K+</div>
                <div className="text-amber-200 text-sm">Téléchargements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">4.8★</div>
                <div className="text-amber-200 text-sm">Note moyenne</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">1000+</div>
                <div className="text-amber-200 text-sm">Histoires</div>
              </div>
            </motion.div>

            {/* Fonctionnalités mobiles */}
            <motion.div variants={itemVariants} className="mt-8">
              <h4 className="text-xl font-bold text-white mb-4">Expérience de jeu mobile optimisée :</h4>
              <ul className="space-y-2 text-amber-200">
                <li className="flex items-center space-x-2">
                  <span className="text-yellow-400">📱</span>
                  <span>Mode hors-ligne pour jouer partout</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-yellow-400">🔄</span>
                  <span>Synchronisation de vos progrès</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-yellow-400">🎮</span>
                  <span>Interface tactile intuitive</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-yellow-400">🔔</span>
                  <span>Notifications pour les nouvelles aventures</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Section QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 pt-16 border-t border-amber-700/30"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Téléchargement rapide</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              {/* QR Code simulé */}
              <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-white text-4xl">📱</div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-amber-200 text-lg mb-2">Scannez le QR code</p>
              <p className="text-white font-semibold">Téléchargement direct sur votre mobile</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DownloadSection