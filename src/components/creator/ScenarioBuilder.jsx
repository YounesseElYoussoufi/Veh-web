import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ScenarioEditor from './ScenarioEditor'
import ScenarioTree from './ScenarioTree'
import ScenarioPreview from './ScenarioPreview'
import { useScenarioManager } from '../../hooks/useScenario'
import { PrimaryButton, SecondaryButton } from '../common/Button'

function ScenarioBuilder({ scenario: initialScenario }) {
  const [viewMode, setViewMode] = useState('editor') // 'editor', 'tree', 'preview'
  const [scenario, setScenario] = useState(initialScenario || {
    id: null,
    title: '',
    description: '',
    text: '',
    choices: [],
    category: '',
    difficulty: '',
    tags: [],
    isPublic: false,
    estimatedTime: '',
    image: '',
    music: ''
  })
  const [scenarioNodes, setScenarioNodes] = useState([])
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { createScenarioSafe, updateScenarioSafe, loading } = useScenarioManager()

  // Détecter les changements non sauvegardés
  useEffect(() => {
    if (initialScenario) {
      const hasChanges = JSON.stringify(scenario) !== JSON.stringify(initialScenario)
      setHasUnsavedChanges(hasChanges)
    } else {
      const isEmpty = !scenario.title && !scenario.text && scenario.choices.length === 0
      setHasUnsavedChanges(!isEmpty)
    }
  }, [scenario, initialScenario])

  const handleScenarioChange = (updates) => {
    setScenario(prev => ({
      ...prev,
      ...updates
    }))
  }

  const handleAddChoice = () => {
    const newChoice = {
      id: Date.now(),
      text: '',
      consequences: '',
      nextScenario: null,
      requirements: null,
      effects: null,
      successChance: 100,
      isRisky: false,
      isHidden: false,
      isOneTime: false
    }
    
    setScenario(prev => ({
      ...prev,
      choices: [...(prev.choices || []), newChoice]
    }))
  }

  const handleSaveScenario = async () => {
    try {
      if (scenario.id) {
        // Mise à jour d'un scénario existant
        const result = await updateScenarioSafe(scenario.id, scenario)
        if (result.success) {
          setHasUnsavedChanges(false)
          // Optionnel : afficher une notification de succès
          console.log('Scénario mis à jour avec succès')
        }
      } else {
        // Création d'un nouveau scénario
        const result = await createScenarioSafe(scenario)
        if (result.success) {
          setScenario(result.scenario)
          setHasUnsavedChanges(false)
          console.log('Nouveau scénario créé avec succès')
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handlePublishScenario = async () => {
    const publishedScenario = {
      ...scenario,
      isPublic: true,
      publishedAt: new Date().toISOString()
    }
    
    await handleScenarioChange(publishedScenario)
    await handleSaveScenario()
  }

  const handleTestScenario = () => {
    setIsPreviewOpen(true)
  }

  const handleExportScenario = () => {
    const dataStr = JSON.stringify(scenario, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${scenario.title || 'scenario'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportScenario = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedScenario = JSON.parse(e.target.result)
          setScenario({
            ...importedScenario,
            id: null, // Nouveau scénario
            title: `${importedScenario.title} (Importé)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublic: false
          })
        } catch (error) {
          console.error('Erreur lors de l\'importation:', error)
          alert('Erreur lors de l\'importation du fichier')
        }
      }
      reader.readAsText(file)
    }
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
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              {scenario.id ? '✏️ Modifier le scénario' : '✨ Nouveau scénario'}
              {hasUnsavedChanges && (
                <span className="text-yellow-400 text-sm">●</span>
              )}
            </h2>
            <p className="text-gray-300">
              {scenario.title || 'Sans titre'} - {scenario.category || 'Aucune catégorie'}
            </p>
            {hasUnsavedChanges && (
              <p className="text-yellow-400 text-sm mt-1">
                Modifications non sauvegardées
              </p>
            )}
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
              icon="👁️"
            >
              Aperçu
            </SecondaryButton>
          </div>
        </div>

        {/* Actions principales */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/20">
          <PrimaryButton 
            onClick={handleSaveScenario} 
            loading={loading}
            icon="💾"
          >
            {scenario.id ? 'Sauvegarder' : 'Créer'}
          </PrimaryButton>
          
          <SecondaryButton 
            onClick={handlePublishScenario} 
            icon="🚀"
            disabled={!scenario.title || !scenario.text}
          >
            {scenario.isPublic ? 'Mettre à jour' : 'Publier'}
          </SecondaryButton>
          
          <SecondaryButton 
            onClick={handleExportScenario} 
            icon="📤"
            disabled={!scenario.title}
          >
            Exporter
          </SecondaryButton>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportScenario}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <SecondaryButton icon="📥">
              Importer
            </SecondaryButton>
          </div>
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
            scenario={scenario}
            onScenarioChange={handleScenarioChange}
            onAddChoice={handleAddChoice}
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
      </motion.div>

      {/* Aperçu du scénario */}
      <ScenarioPreview
        scenario={scenario}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Panneau d'aide */}
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
            <h4 className="font-semibold text-purple-300 mb-2">📖 Narration immersive</h4>
            <p className="text-gray-300">
              Utilisez des descriptions vivantes qui permettent au joueur de visualiser la scène.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-pink-300 mb-2">🎯 Choix significatifs</h4>
            <p className="text-gray-300">
              Chaque choix doit avoir un impact réel sur l'histoire et ses conséquences.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">🔄 Cohérence narrative</h4>
            <p className="text-gray-300">
              Maintenez la logique interne de votre univers tout au long du scénario.
            </p>
          </div>
        </div>

        {/* Raccourcis clavier */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <h4 className="text-white font-medium mb-3 text-sm">⌨️ Raccourcis clavier</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+S</kbd> Sauvegarder</div>
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+P</kbd> Aperçu</div>
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+E</kbd> Exporter</div>
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+N</kbd> Nouveau choix</div>
          </div>
        </div>
      </motion.div>

      {/* Avertissement pour les modifications non sauvegardées */}
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 rounded-xl p-4 text-yellow-100 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium">Modifications non sauvegardées</p>
              <p className="text-sm opacity-80">N'oubliez pas de sauvegarder vos changements</p>
            </div>
            <button
              onClick={handleSaveScenario}
              className="ml-4 px-3 py-1 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors text-sm font-medium"
            >
              Sauvegarder
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ScenarioBuilder