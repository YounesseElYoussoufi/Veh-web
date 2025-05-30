import React, { useState } from 'react'
import { motion } from 'framer-motion'

function ChoiceEditor({ choice, index, onChange, onRemove }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFieldChange = (field, value) => {
    onChange({
      ...choice,
      [field]: value
    })
  }

  const choiceLabels = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/5 border border-white/20 rounded-xl overflow-hidden"
    >
      {/* En-tête du choix */}
      <div className="p-4 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {choiceLabels[index] || index + 1}
          </div>
          <span className="text-white font-medium">
            Choix {index + 1}
          </span>
          {choice.text && (
            <span className="text-gray-400 text-sm truncate max-w-xs">
              "{choice.text.substring(0, 50)}{choice.text.length > 50 ? '...' : ''}"
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title={isExpanded ? 'Réduire' : 'Développer'}
          >
            {isExpanded ? '🔽' : '▶️'}
          </button>
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Supprimer ce choix"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Contenu développé */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 space-y-4">
          {/* Texte du choix */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Texte du choix *
            </label>
            <input
              type="text"
              value={choice.text || ''}
              onChange={(e) => handleFieldChange('text', e.target.value)}
              placeholder="Ex: Ouvrir la porte avec précaution"
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Conséquences */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Conséquences (aperçu pour le joueur)
            </label>
            <input
              type="text"
              value={choice.consequences || ''}
              onChange={(e) => handleFieldChange('consequences', e.target.value)}
              placeholder="Ex: Vous entrez silencieusement dans le couloir"
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Scénario suivant */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Scénario suivant (ID)
              </label>
              <input
                type="number"
                value={choice.nextScenario || ''}
                onChange={(e) => handleFieldChange('nextScenario', parseInt(e.target.value) || null)}
                placeholder="Ex: 5"
                className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Probabilité de succès */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Probabilité de succès (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={choice.successChance || 100}
                onChange={(e) => handleFieldChange('successChance', parseInt(e.target.value) || 100)}
                className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conditions requises */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Conditions requises (JSON)
            </label>
            <textarea
              value={choice.requirements ? JSON.stringify(choice.requirements, null, 2) : ''}
              onChange={(e) => {
                try {
                  const requirements = e.target.value ? JSON.parse(e.target.value) : null
                  handleFieldChange('requirements', requirements)
                } catch (err) {
                  // Ignore les erreurs de parsing pendant la saisie
                }
              }}
              placeholder='{"level": 3, "items": ["key"], "stats": {"force": 10}}'
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-xs"
            />
          </div>

          {/* Effets du choix */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Effets du choix (JSON)
            </label>
            <textarea
              value={choice.effects ? JSON.stringify(choice.effects, null, 2) : ''}
              onChange={(e) => {
                try {
                  const effects = e.target.value ? JSON.parse(e.target.value) : null
                  handleFieldChange('effects', effects)
                } catch (err) {
                  // Ignore les erreurs de parsing pendant la saisie
                }
              }}
              placeholder='{"stats": {"vie": -10, "experience": 50}, "items": ["+épée"]}'
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-xs"
            />
          </div>

          {/* Options avancées */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10">
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={choice.isRisky || false}
                onChange={(e) => handleFieldChange('isRisky', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500"
              />
              Choix risqué
            </label>
            
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={choice.isHidden || false}
                onChange={(e) => handleFieldChange('isHidden', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500"
              />
              Choix caché
            </label>
            
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={choice.isOneTime || false}
                onChange={(e) => handleFieldChange('isOneTime', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500"
              />
              Usage unique
            </label>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ChoiceEditor

