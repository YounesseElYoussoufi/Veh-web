import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function ScenarioPreview({ scenario, isOpen, onClose }) {
  const [currentScenarioId, setCurrentScenarioId] = useState(scenario?.id || 0)
  const [gameState, setGameState] = useState({
    stats: { vie: 100, experience: 0, niveau: 1 },
    inventory: [],
    flags: {}
  })

  // Simulation de navigation dans les scénarios
  const handleChoiceSelect = (choice) => {
    if (choice.nextScenario !== null) {
      setCurrentScenarioId(choice.nextScenario)
      
      // Appliquer les effets du choix
      if (choice.effects) {
        setGameState(prev => ({
          ...prev,
          stats: { ...prev.stats, ...choice.effects.stats },
          inventory: [...prev.inventory, ...(choice.effects.items || [])]
        }))
      }
    }
  }

  const resetPreview = () => {
    setCurrentScenarioId(scenario?.id || 0)
    setGameState({
      stats: { vie: 100, experience: 0, niveau: 1 },
      inventory: [],
      flags: {}
    })
  }

  if (!isOpen || !scenario) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/20 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                🎮 Aperçu de "{scenario.title}"
              </h2>
              <p className="text-purple-200">
                Mode test - Vivez l'expérience comme un joueur
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetPreview}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                🔄 Recommencer
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-colors"
              >
                ✕ Fermer
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Zone de jeu principale */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Titre du scénario actuel */}
              <motion.div
                key={currentScenarioId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h3 className="text-3xl font-bold text-white mb-4">
                  {scenario.title}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              </motion.div>

              {/* Image d'ambiance (si disponible) */}
              {scenario.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={scenario.image}
                    alt={scenario.title}
                    className="w-full h-64 object-cover"
                  />
                </motion.div>
              )}

              {/* Texte du scénario */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <p className="text-gray-300 leading-relaxed text-lg">
                  {scenario.text}
                </p>
              </motion.div>

              {/* Choix */}
              {scenario.choices && scenario.choices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h4 className="text-xl font-bold text-white text-center mb-6">
                    Que faites-vous ?
                  </h4>
                  
                  <div className="space-y-3">
                    {scenario.choices.map((choice, index) => (
                      <motion.button
                        key={choice.id || index}
                        onClick={() => handleChoiceSelect(choice)}
                        whileHover={{ scale: 1.02, x: 10 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 bg-gradient-to-r from-white/5 to-white/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-white/20 rounded-xl text-left transition-all duration-300 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-white font-medium group-hover:text-purple-200 transition-colors">
                              {choice.text}
                            </p>
                            
                            {choice.consequences && (
                              <p className="text-gray-400 text-sm mt-2 group-hover:text-gray-300 transition-colors">
                                → {choice.consequences}
                              </p>
                            )}
                            
                            {choice.requirements && (
                              <div className="mt-2 text-xs text-yellow-400">
                                ⚠️ Requis: {JSON.stringify(choice.requirements)}
                              </div>
                            )}
                          </div>
                          
                          {choice.successChance && choice.successChance < 100 && (
                            <div className="flex-shrink-0 text-xs text-gray-400">
                              {choice.successChance}% réussite
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message de fin si pas de choix */}
              {(!scenario.choices || scenario.choices.length === 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">🏁</div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    Fin du scénario
                  </h4>
                  <p className="text-gray-300">
                    Votre aventure se termine ici... pour le moment !
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Panneau de statut (sidebar) */}
          <div className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/20 p-6 overflow-y-auto">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              📊 État du joueur
            </h4>
            
            {/* Statistiques */}
            <div className="space-y-4 mb-6">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Vie</span>
                  <span className="text-red-400 font-bold">{gameState.stats.vie}/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${gameState.stats.vie}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Expérience</span>
                  <span className="text-blue-400 font-bold">{gameState.stats.experience} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((gameState.stats.experience % 100), 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <span className="text-gray-300 text-sm">Niveau</span>
                <div className="text-2xl font-bold text-yellow-400">{gameState.stats.niveau}</div>
              </div>
            </div>

            {/* Inventaire */}
            <div className="mb-6">
              <h5 className="text-white font-medium mb-3">🎒 Inventaire</h5>
              {gameState.inventory.length > 0 ? (
                <div className="space-y-2">
                  {gameState.inventory.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-2 text-sm text-gray-300">
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">Inventaire vide</p>
              )}
            </div>

            {/* Informations du scénario */}
            <div className="border-t border-white/10 pt-4">
              <h5 className="text-white font-medium mb-3">ℹ️ Informations</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulté:</span>
                  <span className="text-white">{scenario.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Catégorie:</span>
                  <span className="text-white">{scenario.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Temps estimé:</span>
                  <span className="text-white">{scenario.estimatedTime}</span>
                </div>
              </div>
            </div>

            {/* Contrôles de débogage */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <h5 className="text-white font-medium mb-3">🛠️ Débogage</h5>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors">
                  📍 Scénario #{currentScenarioId}
                </button>
                <button className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors">
                  🔍 Voir les données
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ScenarioPreview