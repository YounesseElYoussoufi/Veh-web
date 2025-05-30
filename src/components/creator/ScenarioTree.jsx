import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

function ScenarioTree({ scenarios, selectedNodeId, onNodeSelect, onNodeUpdate }) {
  const [draggedNode, setDraggedNode] = useState(null)
  const [connections, setConnections] = useState([])
  const svgRef = useRef(null)

  // Exemple de données de scénarios pour la démo
  const demoScenarios = scenarios.length > 0 ? scenarios : [
    {
      id: 0,
      title: "Le Commencement",
      x: 100,
      y: 100,
      choices: [
        { text: "Ouvrir la porte", nextScenario: 1 },
        { text: "Chercher une arme", nextScenario: 2 }
      ]
    },
    {
      id: 1,
      title: "Le Couloir",
      x: 300,
      y: 50,
      choices: [
        { text: "Avancer silencieusement", nextScenario: 3 }
      ]
    },
    {
      id: 2,
      title: "Recherche d'arme",
      x: 300,
      y: 150,
      choices: [
        { text: "Prendre la dague", nextScenario: 1 }
      ]
    },
    {
      id: 3,
      title: "La Conversation",
      x: 500,
      y: 50,
      choices: []
    }
  ]

  useEffect(() => {
    // Calculer les connexions entre les nœuds
    const newConnections = []
    demoScenarios.forEach(scenario => {
      scenario.choices?.forEach(choice => {
        const targetScenario = demoScenarios.find(s => s.id === choice.nextScenario)
        if (targetScenario) {
          newConnections.push({
            from: scenario,
            to: targetScenario,
            choiceText: choice.text
          })
        }
      })
    })
    setConnections(newConnections)
  }, [demoScenarios])

  const handleNodeDrag = (nodeId, newX, newY) => {
    onNodeUpdate(nodeId, { x: newX, y: newY })
  }

  const ScenarioNode = ({ scenario }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    const handleMouseDown = (e) => {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - scenario.x,
        y: e.clientY - scenario.y
      })
    }

    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        handleNodeDrag(scenario.id, newX, newY)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }
      }
    }, [isDragging, dragStart])

    const isSelected = selectedNodeId === scenario.id
    const choiceCount = scenario.choices?.length || 0

    return (
      <motion.div
        className={`absolute cursor-move ${isDragging ? 'z-50' : 'z-10'}`}
        style={{ left: scenario.x, top: scenario.y }}
        whileHover={{ scale: 1.05 }}
        animate={{
          scale: isSelected ? 1.1 : 1,
          zIndex: isSelected ? 20 : 10
        }}
      >
        <div
          className={`
            bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl border-2 cursor-move
            ${isSelected ? 'border-yellow-400 shadow-yellow-400/50' : 'border-white/20'}
            ${isDragging ? 'opacity-80' : 'opacity-100'}
            min-w-48 max-w-64
          `}
          onMouseDown={handleMouseDown}
          onClick={() => onNodeSelect(scenario.id)}
        >
          {/* En-tête du nœud */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">#{scenario.id}</span>
              {choiceCount > 0 && (
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  {choiceCount} choix
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <button className="text-white/70 hover:text-white text-sm">✏️</button>
              <button className="text-white/70 hover:text-red-400 text-sm">🗑️</button>
            </div>
          </div>

          {/* Titre du scénario */}
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
            {scenario.title}
          </h3>

          {/* Aperçu des choix */}
          {scenario.choices && scenario.choices.length > 0 && (
            <div className="space-y-1">
              {scenario.choices.slice(0, 2).map((choice, index) => (
                <div
                  key={index}
                  className="text-xs text-white/80 bg-white/10 rounded px-2 py-1 truncate"
                >
                  {String.fromCharCode(65 + index)}. {choice.text}
                </div>
              ))}
              {scenario.choices.length > 2 && (
                <div className="text-xs text-white/60 text-center">
                  +{scenario.choices.length - 2} autres...
                </div>
              )}
            </div>
          )}

          {/* Points de connexion */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-white rounded-full border-2 border-purple-600"></div>
          </div>
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-white rounded-full border-2 border-purple-600"></div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          🌳 Arbre des Scénarios
        </h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
            ➕ Ajouter
          </button>
          <button className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
            🔄 Réorganiser
          </button>
          <button className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
            💾 Sauvegarder
          </button>
        </div>
      </div>

      {/* Zone de dessin */}
      <div className="relative h-96 overflow-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        {/* SVG pour les connexions */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {connections.map((connection, index) => {
            const startX = connection.from.x + 192 // largeur du nœud
            const startY = connection.from.y + 60  // hauteur du nœud / 2
            const endX = connection.to.x
            const endY = connection.to.y + 60

            // Calcul de la courbe de Bézier
            const midX = (startX + endX) / 2
            const controlX1 = startX + 50
            const controlX2 = endX - 50

            return (
              <g key={index}>
                {/* Ligne de connexion */}
                <path
                  d={`M ${startX} ${startY} C ${controlX1} ${startY} ${controlX2} ${endY} ${endX} ${endY}`}
                  stroke="rgba(147, 51, 234, 0.6)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
                
                {/* Flèche */}
                <polygon
                  points={`${endX-8},${endY-4} ${endX},${endY} ${endX-8},${endY+4}`}
                  fill="rgba(147, 51, 234, 0.8)"
                />
                
                {/* Label du choix */}
                <text
                  x={midX}
                  y={((startY + endY) / 2) - 5}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  <tspan className="bg-gray-800 px-2 py-1 rounded">
                    {connection.choiceText.substring(0, 20)}
                    {connection.choiceText.length > 20 ? '...' : ''}
                  </tspan>
                </text>
              </g>
            )
          })}
        </svg>

        {/* Nœuds de scénarios */}
        {demoScenarios.map(scenario => (
          <ScenarioNode key={scenario.id} scenario={scenario} />
        ))}

        {/* Message si vide */}
        {demoScenarios.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🌳</div>
              <h4 className="text-xl font-bold text-white mb-2">
                Aucun scénario dans l'arbre
              </h4>
              <p className="text-gray-300 mb-4">
                Commencez par créer votre premier scénario
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
                ➕ Créer le premier scénario
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Légende */}
      <div className="p-4 border-t border-white/20 bg-white/5">
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
            <span>Scénario</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-purple-500"></div>
            <span>Connexion</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-yellow-400 rounded"></div>
            <span>Sélectionné</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScenarioTree