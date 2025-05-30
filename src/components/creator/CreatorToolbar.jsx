import React, { useState } from 'react'
import { motion } from 'framer-motion'

function CreatorToolbar() {
  const [isExpanded, setIsExpanded] = useState(false)

  const tools = [
    { id: 'auto-save', icon: '💾', label: 'Sauvegarde auto', active: true },
    { id: 'spell-check', icon: '🔤', label: 'Vérification orthographe', active: false },
    { id: 'ai-assistant', icon: '🤖', label: 'Assistant IA', active: false },
    { id: 'templates', icon: '📋', label: 'Templates', active: false },
    { id: 'preview', icon: '👁️', label: 'Aperçu temps réel', active: false },
    { id: 'collaboration', icon: '👥', label: 'Collaboration', active: false }
  ]

  const quickActions = [
    { id: 'duplicate', icon: '📄', label: 'Dupliquer', action: () => console.log('Duplicate') },
    { id: 'export', icon: '📤', label: 'Exporter', action: () => console.log('Export') },
    { id: 'import', icon: '📥', label: 'Importer', action: () => console.log('Import') },
    { id: 'validate', icon: '✅', label: 'Valider', action: () => console.log('Validate') },
    { id: 'test', icon: '🎮', label: 'Tester', action: () => console.log('Test') },
    { id: 'share', icon: '🔗', label: 'Partager', action: () => console.log('Share') }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-md rounded-2xl border border-purple-500/30 overflow-hidden"
    >
      {/* Header de la toolbar */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🛠️</div>
          <h3 className="text-lg font-bold text-white">Outils de création</h3>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        >
          {isExpanded ? '🔼' : '🔽'}
        </button>
      </div>

      {/* Actions rapides (toujours visibles) */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {quickActions.map(action => (
            <motion.button
              key={action.id}
              onClick={action.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm"
              title={action.label}
            >
              <span>{action.icon}</span>
              <span className="hidden sm:inline">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Outils avancés (extensibles) */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 border-t border-white/10">
          <div className="pt-4 space-y-3">
            <h4 className="text-white font-medium mb-3">Outils avancés</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tools.map(tool => (
                <motion.div
                  key={tool.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{tool.label}</div>
                  </div>
                  <button
                    className={`w-10 h-6 rounded-full transition-all ${
                      tool.active 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      tool.active ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Statistiques rapides */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">2.5K</div>
                <div className="text-xs text-gray-400">Mots écrits</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-pink-400">12</div>
                <div className="text-xs text-gray-400">Scénarios</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">45</div>
                <div className="text-xs text-gray-400">Choix créés</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">8h</div>
                <div className="text-xs text-gray-400">Temps passé</div>
              </div>
            </div>

            {/* Raccourcis clavier */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <h5 className="text-white font-medium mb-2 text-sm">Raccourcis clavier</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
                <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+S</kbd> Sauvegarder</div>
                <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+Z</kbd> Annuler</div>
                <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+Y</kbd> Refaire</div>
                <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+P</kbd> Aperçu</div>
                <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+N</kbd> Nouveau choix</div>
                <div><kbd className="bg-gray-700 px-1 rounded">F11</kbd> Plein écran</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CreatorToolbar

