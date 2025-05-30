import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    { title: 'Aventures Créées', value: '12', icon: '🏆' },
    { title: 'Heures de Création', value: '48h', icon: '⏱️' },
    { title: 'Joueurs Touchés', value: '1.2K', icon: '👥' },
    { title: 'Note Moyenne', value: '4.8', icon: '⭐' },
  ]

  const recentScenarios = [
    { title: 'La Quête du Dragon Éternel', status: 'Publié', players: 234 },
    { title: 'Les Mystères de l\'Atlantide', status: 'En cours', players: 0 },
    { title: 'L\'Épée des Anciens', status: 'Brouillon', players: 0 },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Bienvenue, {user?.username || 'Créateur'} ! 🎭
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Prêt à créer votre prochaine aventure épique ?
            </p>
            
            <motion.button
              onClick={() => navigate('/creator')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full text-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
            >
              🚀 Accéder au Studio de Création
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-purple-200">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Scenarios */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Mes Scénarios</h2>
              <div className="space-y-4">
                {recentScenarios.map((scenario, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium">{scenario.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        scenario.status === 'Publié' 
                          ? 'bg-green-500/20 text-green-400' 
                          : scenario.status === 'En cours'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {scenario.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{scenario.players} joueurs</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Actions Rapides</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/creator')}
                  className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  ✨ Nouveau Scénario
                </button>
                <button className="w-full p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
                  📚 Mes Templates
                </button>
                <button className="w-full p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
                  📊 Analyses & Stats
                </button>
                <button className="w-full p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
                  👥 Communauté
                </button>
              </div>
            </motion.div>
          </div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Dernières Réalisations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="text-white font-medium">Premier Créateur</p>
                  <p className="text-gray-400 text-sm">Créé votre premier scénario</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="text-white font-medium">Populaire</p>
                  <p className="text-gray-400 text-sm">100+ joueurs sur un scénario</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <span className="text-2xl">🌟</span>
                <div>
                  <p className="text-white font-medium">Bien Noté</p>
                  <p className="text-gray-400 text-sm">Note moyenne de 4.5+</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard