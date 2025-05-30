import React, { useState } from 'react'
import { motion } from 'framer-motion'

function ScenarioCard({ scenario, onEdit, onPreview, onShare, onDelete }) {
  const [isHovered, setIsHovered] = useState(false)

  const difficultyColors = {
    'Facile': 'from-green-500 to-emerald-600',
    'Moyen': 'from-yellow-500 to-orange-600',
    'Difficile': 'from-red-500 to-pink-600'
  }

  const categoryIcons = {
    'Aventure': '🗺️',
    'Mystère': '🔍',
    'Horreur': '👻',
    'Romance': '💕',
    'Science-Fiction': '🚀',
    'Fantasy': '🐉',
    'Politique': '👑',
    'Action': '⚔️',
    'Comédie': '😄',
    'Drame': '🎭'
  }

  return (
    <motion.div
      className="relative group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
        {/* Image de couverture */}
        <div className="relative h-48 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-80">
              {categoryIcons[scenario.category] || '🎮'}
            </div>
          </div>
          
          {/* Badge de difficulté */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 bg-gradient-to-r ${difficultyColors[scenario.difficulty]} text-white text-sm font-bold rounded-full shadow-lg`}>
              {scenario.difficulty}
            </div>
          </div>
          
          {/* Badge de catégorie */}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
              {scenario.category}
            </div>
          </div>

          {/* Overlay au hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center"
          >
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onPreview() }}
                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                title="Prévisualiser"
              >
                👁️
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onEdit() }}
                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                title="Modifier"
              >
                ✏️
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onShare() }}
                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                title="Partager"
              >
                🔗
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Contenu de la carte */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-white line-clamp-2 flex-1">
              {scenario.title}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="text-gray-400 hover:text-red-400 transition-colors ml-2"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {scenario.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {scenario.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Métadonnées */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                ⏱️ {scenario.estimatedTime}
              </span>
              <span className="flex items-center gap-1">
                👥 {Math.floor(Math.random() * 1000) + 100}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progression</span>
              <span>{Math.floor(Math.random() * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.floor(Math.random() * 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Actions au clic */}
        <motion.div
          className="absolute inset-0 border-2 rounded-2xl"
          style={{ borderColor: 'transparent' }}
          animate={{
            borderColor: isHovered ? 'rgba(147, 51, 234, 0.5)' : 'transparent'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Effet de brillance */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </motion.div>
  )
}

export default ScenarioCard