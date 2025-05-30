import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ScenarioTree from './ScenarioTree'
import ScenarioEditor from './ScenarioEditor'
import { PrimaryButton, SecondaryButton } from '../common/Button'

function ScenarioBuilder({ scenario }) {
  const [viewMode, setViewMode] = useState('editor') // 'editor', 'tree', 'preview'
  const [currentScenario, setCurrentScenario] = useState(scenario || {
    id: Date.now(),
    title: '',
    text: '',
    choices: []
  })
  const [scenarioNodes, setScenarioNodes] = useState([])
  const [selectedNodeId, setSelectedNodeId] = useState(null)

  const handleSaveScenario = () => {
    console.log('Sauvegarde du scénario:', currentScenario)
    // Ici, on ferait l'appel API pour sauvegarder
  }

  const handlePublishScenario = () => {
    console.log('Publication du scénario:', currentScenario)
    // Ici, on ferait l'appel API pour publier
  }

  const handleTestScenario = () => {
    console.log('Test du scénario:', currentScenario)
    setViewMode('preview')
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {scenario ? 'Modifier le scénario' : 'Nouveau scénario'}
            </h2>
            <p className="text-gray-300">
              Créez une aventure interactive captivante pour vos joueurs
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <SecondaryButton
              onClick={() => setViewMode('editor')}
              variant={viewMode === 'editor' ? 'primary' : 'secondary'}
              icon="✏️"
            >
              Éditeur
            </SecondaryButton>
            <SecondaryButton
              onClick={() => setViewMode('tree')}
              variant={viewMode === 'tree' ? 'primary' : 'secondary'}
              icon="🌳"
            >
              Arbre
            </SecondaryButton>
            <SecondaryButton
              onClick={handleTestScenario}
              variant={viewMode === 'preview' ? 'primary' : 'secondary'}
              icon="👁️"
            >
              Aperçu
            </SecondaryButton>
          </div>
        </div>

        {/* Actions principales */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/20">
          <PrimaryButton onClick={handleSaveScenario} icon="💾">
            Sauvegarder
          </PrimaryButton>
          <SecondaryButton onClick={handlePublishScenario} icon="🚀">
            Publier
          </SecondaryButton>
          <SecondaryButton icon="📤">
            Exporter
          </SecondaryButton>
          <SecondaryButton icon="📥">
            Importer
          </SecondaryButton>
        </div>
      </motion.div>

      {/* Zone de contenu principal */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-96"
      >
        {viewMode === 'editor' && (
          <ScenarioEditor
            scenario={currentScenario}
            onScenarioChange={setCurrentScenario}
            onAddChoice={() => {
              setCurrentScenario(prev => ({
                ...prev,
                choices: [...(prev.choices || []), {
                  id: Date.now(),
                  text: '',
                  nextScenario: null,
                  consequences: ''
                }]
              }))
            }}
          />
        )}

        {viewMode === 'tree' && (
          <ScenarioTree
            scenarios={scenarioNodes}
            selectedNodeId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
            onNodeUpdate={(nodeId, data) => {
              setScenarioNodes(prev => 
                prev.map(node => 
                  node.id === nodeId ? { ...node, ...data } : node
                )
              )
            }}
          />
        )}

        {viewMode === 'preview' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-6 text-center">
                Aperçu du Scénario
              </h3>
              
              {currentScenario.title && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-purple-300 mb-4">
                    {currentScenario.title}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {currentScenario.text}
                  </p>
                </div>
              )}

              {currentScenario.choices && currentScenario.choices.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-lg font-semibold text-white mb-4">
                    Que faites-vous ?
                  </h5>
                  {currentScenario.choices.map((choice, index) => (
                    <motion.button
                      key={choice.id || index}
                      whileHover={{ scale: 1.02, x: 10 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-left text-white transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-purple-400 font-bold">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <div>
                          <p className="font-medium">{choice.text}</p>
                          {choice.consequences && (
                            <p className="text-sm text-gray-400 mt-1">
                              → {choice.consequences}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {(!currentScenario.title && !currentScenario.text) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Aperçu vide
                  </h4>
                  <p className="text-gray-300">
                    Commencez par remplir le titre et le texte de votre scénario
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Panneau d'aide latéral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          💡 Conseils de création
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-purple-300 mb-2">📖 Narration</h4>
            <p className="text-gray-300">
              Créez une atmosphère immersive avec des descriptions vivantes et engageantes.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-pink-300 mb-2">🎯 Choix</h4>
            <p className="text-gray-300">
              Offrez des choix significatifs qui impactent réellement l'histoire.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">🔄 Conséquences</h4>
            <p className="text-gray-300">
              Chaque décision doit avoir des répercussions claires et logiques.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ScenarioBuilder