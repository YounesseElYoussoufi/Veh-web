import React, { createContext, useContext, useState, useEffect } from 'react'
import { scenarios as defaultScenarios, availableScenarios } from '../data/scenarios'

const ScenarioContext = createContext()

export function useScenario() {
  const context = useContext(ScenarioContext)
  if (!context) {
    throw new Error('useScenario must be used within a ScenarioProvider')
  }
  return context
}

export function ScenarioProvider({ children }) {
  const [scenarios, setScenarios] = useState(defaultScenarios)
  const [userScenarios, setUserScenarios] = useState(availableScenarios)
  const [currentScenario, setCurrentScenario] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    category: 'Tous',
    difficulty: 'Toutes',
    searchTerm: '',
    tags: []
  })

  // Charger les scénarios depuis le localStorage au démarrage
  useEffect(() => {
    const savedScenarios = localStorage.getItem('user_scenarios')
    if (savedScenarios) {
      try {
        const parsed = JSON.parse(savedScenarios)
        setUserScenarios(parsed)
      } catch (error) {
        console.error('Erreur lors du chargement des scénarios:', error)
      }
    }
  }, [])

  // Sauvegarder les scénarios dans le localStorage
  const saveToLocalStorage = (scenariosToSave) => {
    try {
      localStorage.setItem('user_scenarios', JSON.stringify(scenariosToSave))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  // Créer un nouveau scénario
  const createScenario = (scenarioData) => {
    const newScenario = {
      id: Date.now().toString(),
      ...scenarioData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      stats: {
        views: 0,
        plays: 0,
        ratings: [],
        averageRating: 0
      }
    }
    
    const updatedScenarios = [...userScenarios, newScenario]
    setUserScenarios(updatedScenarios)
    saveToLocalStorage(updatedScenarios)
    
    return newScenario
  }

  // Mettre à jour un scénario existant
  const updateScenario = (scenarioId, updates) => {
    const updatedScenarios = userScenarios.map(scenario => 
      scenario.id === scenarioId 
        ? { 
            ...scenario, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          }
        : scenario
    )
    
    setUserScenarios(updatedScenarios)
    saveToLocalStorage(updatedScenarios)
    
    // Mettre à jour le scénario actuel si c'est celui qu'on modifie
    if (currentScenario?.id === scenarioId) {
      setCurrentScenario(prev => ({ ...prev, ...updates }))
    }
  }

  // Supprimer un scénario
  const deleteScenario = (scenarioId) => {
    const updatedScenarios = userScenarios.filter(scenario => scenario.id !== scenarioId)
    setUserScenarios(updatedScenarios)
    saveToLocalStorage(updatedScenarios)
    
    if (currentScenario?.id === scenarioId) {
      setCurrentScenario(null)
    }
  }

  // Dupliquer un scénario
  const duplicateScenario = (scenarioId) => {
    const scenarioToDuplicate = userScenarios.find(s => s.id === scenarioId)
    if (scenarioToDuplicate) {
      const duplicatedScenario = {
        ...scenarioToDuplicate,
        id: Date.now().toString(),
        title: `${scenarioToDuplicate.title} (Copie)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        stats: {
          views: 0,
          plays: 0,
          ratings: [],
          averageRating: 0
        }
      }
      
      const updatedScenarios = [...userScenarios, duplicatedScenario]
      setUserScenarios(updatedScenarios)
      saveToLocalStorage(updatedScenarios)
      
      return duplicatedScenario
    }
  }

  // Filtrer les scénarios
  const getFilteredScenarios = () => {
    return userScenarios.filter(scenario => {
      const matchesCategory = filters.category === 'Tous' || scenario.category === filters.category
      const matchesDifficulty = filters.difficulty === 'Toutes' || scenario.difficulty === filters.difficulty
      const matchesSearch = scenario.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           scenario.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      const matchesTags = filters.tags.length === 0 || 
                         filters.tags.some(tag => scenario.tags?.includes(tag))
      
      return matchesCategory && matchesDifficulty && matchesSearch && matchesTags
    })
  }

  // Obtenir les statistiques globales
  const getStats = () => {
    const totalScenarios = userScenarios.length
    const publishedScenarios = userScenarios.filter(s => s.isPublic).length
    const totalPlays = userScenarios.reduce((acc, s) => acc + (s.stats?.plays || 0), 0)
    const averageRating = userScenarios.reduce((acc, s) => acc + (s.stats?.averageRating || 0), 0) / totalScenarios || 0
    
    return {
      totalScenarios,
      publishedScenarios,
      draftScenarios: totalScenarios - publishedScenarios,
      totalPlays,
      averageRating: Math.round(averageRating * 10) / 10
    }
  }

  // Exporter les scénarios
  const exportScenarios = (scenarioIds = null) => {
    const scenariosToExport = scenarioIds 
      ? userScenarios.filter(s => scenarioIds.includes(s.id))
      : userScenarios
    
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      scenarios: scenariosToExport
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scenarios-export-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Importer des scénarios
  const importScenarios = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result)
          const importedScenarios = importData.scenarios || []
          
          // Générer de nouveaux IDs pour éviter les conflits
          const scenariosWithNewIds = importedScenarios.map(scenario => ({
            ...scenario,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            title: `${scenario.title} (Importé)`
          }))
          
          const updatedScenarios = [...userScenarios, ...scenariosWithNewIds]
          setUserScenarios(updatedScenarios)
          saveToLocalStorage(updatedScenarios)
          
          resolve(scenariosWithNewIds.length)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'))
      reader.readAsText(file)
    })
  }

  // Obtenir un scénario par ID
  const getScenarioById = (id) => {
    return userScenarios.find(scenario => scenario.id === id) || 
           scenarios.find(scenario => scenario.id === parseInt(id))
  }

  // Publier/dépublier un scénario
  const togglePublishScenario = (scenarioId) => {
    updateScenario(scenarioId, { 
      isPublic: !getScenarioById(scenarioId)?.isPublic 
    })
  }

  const value = {
    // État
    scenarios,
    userScenarios,
    currentScenario,
    isLoading,
    filters,
    
    // Actions
    setCurrentScenario,
    setFilters,
    createScenario,
    updateScenario,
    deleteScenario,
    duplicateScenario,
    getFilteredScenarios,
    getStats,
    exportScenarios,
    importScenarios,
    getScenarioById,
    togglePublishScenario,
    
    // Utilitaires
    setIsLoading
  }

  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  )
}