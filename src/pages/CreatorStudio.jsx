import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import ScenarioLibrary from '../components/creator/ScenarioLibrary'
import ScenarioBuilder from '../components/creator/ScenarioBuilder'
import CreatorToolbar from '../components/creator/CreatorToolbar'
import { PrimaryButton, SecondaryButton } from '../components/common/Button'

function CreatorStudio() {
  const [activeTab, setActiveTab] = useState('library')
  const [selectedScenario, setSelectedScenario] = useState(null)

  const tabs = [
    { id: 'library', label: 'Bibliothèque', icon: '📚' },
    { id: 'builder', label: 'Créateur', icon: '🏗️' },
    { id: 'templates', label: 'Templates', icon: '📝' },
    { id: 'analytics', label: 'Analyses', icon: '📊' }
  ]

  const handleCreateNew = () => {
    setSelectedScenario(null)
    setActiveTab('builder')
  }

  const handleEditScenario = (scenario) => {
    setSelectedScenario(scenario)
    setActiveTab('builder')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              🎭 Studio de Création
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Créez des aventures épiques qui captiveront vos joueurs
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <PrimaryButton 
                onClick={handleCreateNew}
                icon="✨"
                size="large"
              >
                Nouvelle Aventure
              </PrimaryButton>
              <SecondaryButton 
                onClick={() => setActiveTab('templates')}
                icon="📋"
                size="large"
              >
                Utiliser un Template
              </SecondaryButton>
            </div>
          </motion.div>

          {/* Creator Toolbar */}
          <CreatorToolbar />

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-6 py-3 rounded-xl font-medium transition-all duration-300
                      flex items-center gap-2
                      ${activeTab === tab.id 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-96"
          >
            {activeTab === 'library' && (
              <ScenarioLibrary onEditScenario={handleEditScenario} />
            )}
            
            {activeTab === 'builder' && (
              <ScenarioBuilder scenario={selectedScenario} />
            )}
            
            {activeTab === 'templates' && (
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-white mb-4">Templates à venir</h2>
                <p className="text-gray-300">
                  Des templates prêts à l'emploi pour accélérer votre création
                </p>
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-white mb-4">Analyses des performances</h2>
                <p className="text-gray-300">
                  Suivez l'engagement de vos joueurs et optimisez vos scénarios
                </p>
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl mb-2">🎮</div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-gray-300">Scénarios créés</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-white">1,234</div>
              <div className="text-gray-300">Joueurs actifs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-gray-300">Note moyenne</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">5</div>
              <div className="text-gray-300">Prix remportés</div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default CreatorStudio