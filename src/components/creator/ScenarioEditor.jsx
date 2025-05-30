import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { scenarioCategories, difficultyLevels } from '../../data/scenarios'
import ChoiceEditor from './ChoiceEditor'

function ScenarioEditor({ scenario, onScenarioChange, onAddChoice }) {
  const [activeTab, setActiveTab] = useState('basic')

  const handleFieldChange = (field, value) => {
    onScenarioChange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleChoiceChange = (choiceIndex, choiceData) => {
    const updatedChoices = [...(scenario.choices || [])]
    updatedChoices[choiceIndex] = choiceData
    handleFieldChange('choices', updatedChoices)
  }

  const handleRemoveChoice = (choiceIndex) => {
    const updatedChoices = scenario.choices.filter((_, index) => index !== choiceIndex)
    handleFieldChange('choices', updatedChoices)
  }

  const tabs = [
    { id: 'basic', label: 'Informations de base', icon: '📝' },
    { id: 'content', label: 'Contenu', icon: '📖' },
    { id: 'choices', label: 'Choix', icon: '🎯' },
    { id: 'advanced', label: 'Avancé', icon: '⚙️' }
  ]

  return (
    <div className="space-y-6">
      {/* Navigation des onglets */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                flex items-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Informations de base</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Titre */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Titre du scénario *
                </label>
                <input
                  type="text"
                  value={scenario.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Ex: La Quête du Dragon Éternel"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Catégorie
                </label>
                <select
                  value={scenario.category || ''}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">Choisir une catégorie</option>
                  {scenarioCategories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulté */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Difficulté
                </label>
                <select
                  value={scenario.difficulty || ''}
                  onChange={(e) => handleFieldChange('difficulty', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">Choisir la difficulté</option>
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value} className="bg-gray-800">
                      {level.value} - {level.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Temps estimé */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Temps estimé
                </label>
                <input
                  type="text"
                  value={scenario.estimatedTime || ''}
                  onChange={(e) => handleFieldChange('estimatedTime', e.target.value)}
                  placeholder="Ex: 30-45 min"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Description courte
              </label>
              <textarea
                value={scenario.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Décrivez votre scénario en quelques phrases captivantes..."
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={scenario.tags?.join(', ') || ''}
                onChange={(e) => handleFieldChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                placeholder="Ex: aventure, mystère, combat"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Contenu du scénario</h3>
            
            {/* Texte principal */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Texte du scénario *
              </label>
              <textarea
                value={scenario.text || ''}
                onChange={(e) => handleFieldChange('text', e.target.value)}
                placeholder="Racontez votre histoire... Immergez le joueur dans votre univers avec des descriptions vivantes et captivantes."
                rows={8}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <p className="text-gray-400 text-sm mt-2">
                {scenario.text?.length || 0} caractères
              </p>
            </div>

            {/* Image d'ambiance (optionnel) */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Image d'ambiance (URL)
              </label>
              <input
                type="url"
                value={scenario.image || ''}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                placeholder="https://exemple.com/image.jpg"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Musique d'ambiance (optionnel) */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Musique d'ambiance (URL)
              </label>
              <input
                type="url"
                value={scenario.music || ''}
                onChange={(e) => handleFieldChange('music', e.target.value)}
                placeholder="https://exemple.com/musique.mp3"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {activeTab === 'choices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Choix du joueur</h3>
              <button
                onClick={onAddChoice}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2"
              >
                <span>➕</span>
                Ajouter un choix
              </button>
            </div>

            {scenario.choices && scenario.choices.length > 0 ? (
              <div className="space-y-4">
                {scenario.choices.map((choice, index) => (
                  <ChoiceEditor
                    key={choice.id || index}
                    choice={choice}
                    index={index}
                    onChange={(choiceData) => handleChoiceChange(index, choiceData)}
                    onRemove={() => handleRemoveChoice(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-xl">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Aucun choix défini
                </h4>
                <p className="text-gray-300 mb-4">
                  Ajoutez des choix pour permettre au joueur d'interagir avec votre histoire
                </p>
                <button
                  onClick={onAddChoice}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  ➕ Créer le premier choix
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Paramètres avancés</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conditions */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Conditions d'accès (JSON)
                </label>
                <textarea
                  value={scenario.conditions ? JSON.stringify(scenario.conditions, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      const conditions = JSON.parse(e.target.value)
                      handleFieldChange('conditions', conditions)
                    } catch (err) {
                      // Ignore les erreurs de parsing pendant la saisie
                    }
                  }}
                  placeholder='{"level": 5, "items": ["key"]}'
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                />
              </div>

              {/* Récompenses */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Récompenses (JSON)
                </label>
                <textarea
                  value={scenario.rewards ? JSON.stringify(scenario.rewards, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      const rewards = JSON.parse(e.target.value)
                      handleFieldChange('rewards', rewards)
                    } catch (err) {
                      // Ignore les erreurs de parsing pendant la saisie
                    }
                  }}
                  placeholder='{"xp": 100, "items": ["sword"]}'
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                />
              </div>
            </div>

            {/* Options de publication */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Options de publication</h4>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="public"
                  checked={scenario.isPublic || false}
                  onChange={(e) => handleFieldChange('isPublic', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500"
                />
                <label htmlFor="featured" className="text-white">
                  Proposer en scénario mis en avant
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowComments"
                  checked={scenario.allowComments || false}
                  onChange={(e) => handleFieldChange('allowComments', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500"
                />
                <label htmlFor="allowComments" className="text-white">
                  Autoriser les commentaires
                </label>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ScenarioEditor