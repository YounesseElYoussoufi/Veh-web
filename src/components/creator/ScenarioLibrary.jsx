import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { availableScenarios, scenarioCategories, difficultyLevels } from '../../data/scenarios'
import ScenarioCard from './ScenarioCard'

function ScenarioLibrary({ onEditScenario }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Toutes')
  const [sortBy, setSortBy] = useState('recent')

  // Filtrage des scénarios
  const filteredScenarios = availableScenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tous' || scenario.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'Toutes' || scenario.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="space-y-8">
      {/* Filtres et Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un scénario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              🔍
            </div>
          </div>

          {/* Catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Tous">Toutes catégories</option>
            {scenarioCategories.map(category => (
              <option key={category} value={category} className="bg-gray-800">
                {category}
              </option>
            ))}
          </select>

          {/* Difficulté */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Toutes">Toutes difficultés</option>
            {difficultyLevels.map(level => (
              <option key={level.value} value={level.value} className="bg-gray-800">
                {level.value}
              </option>
            ))}
          </select>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="recent" className="bg-gray-800">Plus récents</option>
            <option value="popular" className="bg-gray-800">Plus populaires</option>
            <option value="title" className="bg-gray-800">Par titre</option>
            <option value="difficulty" className="bg-gray-800">Par difficulté</option>
          </select>
        </div>
      </motion.div>

      {/* Résultats */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Mes Scénarios ({filteredScenarios.length})
          </h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              📊
            </button>
            <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              📋
            </button>
          </div>
        </div>

        {/* Grille des scénarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ScenarioCard 
                scenario={scenario} 
                onEdit={() => onEditScenario(scenario)}
                onPreview={() => console.log('Preview', scenario.id)}
                onShare={() => console.log('Share', scenario.id)}
                onDelete={() => console.log('Delete', scenario.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredScenarios.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">Aucun scénario trouvé</h3>
            <p className="text-gray-300 mb-6">
              Essayez de modifier vos critères de recherche ou créez votre premier scénario
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all">
              ✨ Créer mon premier scénario
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ScenarioLibrary
