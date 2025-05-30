import { useState, useEffect, useCallback } from 'react'
import { useScenario as useScenarioContext } from '../contexts/ScenarioContext'

// Hook principal pour la gestion des scénarios
export const useScenarioManager = () => {
  const context = useScenarioContext()
  const [localLoading, setLocalLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fonction pour créer un scénario avec gestion d'erreur
  const createScenarioSafe = useCallback(async (scenarioData) => {
    setLocalLoading(true)
    setError(null)
    
    try {
      const newScenario = context.createScenario(scenarioData)
      return { success: true, scenario: newScenario }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLocalLoading(false)
    }
  }, [context])

  // Fonction pour mettre à jour un scénario avec gestion d'erreur
  const updateScenarioSafe = useCallback(async (scenarioId, updates) => {
    setLocalLoading(true)
    setError(null)
    
    try {
      context.updateScenario(scenarioId, updates)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLocalLoading(false)
    }
  }, [context])

  // Fonction pour supprimer un scénario avec confirmation
  const deleteScenarioSafe = useCallback(async (scenarioId) => {
    setLocalLoading(true)
    setError(null)
    
    try {
      context.deleteScenario(scenarioId)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLocalLoading(false)
    }
  }, [context])

  return {
    ...context,
    createScenarioSafe,
    updateScenarioSafe,
    deleteScenarioSafe,
    loading: localLoading || context.isLoading,
    error,
    clearError: () => setError(null)
  }
}

// Hook pour la validation des scénarios
export const useScenarioValidation = () => {
  const validateScenario = useCallback((scenario) => {
    const errors = []
    const warnings = []
    
    // Validation du titre
    if (!scenario.title || scenario.title.trim().length < 3) {
      errors.push('Le titre doit contenir au moins 3 caractères')
    } else if (scenario.title.length > 100) {
      warnings.push('Le titre est très long (plus de 100 caractères)')
    }
    
    // Validation du texte
    if (!scenario.text || scenario.text.trim().length < 20) {
      errors.push('Le texte doit contenir au moins 20 caractères')
    } else if (scenario.text.length < 100) {
      warnings.push('Le texte est assez court, considérez l\'enrichir')
    }
    
    // Validation de la description
    if (!scenario.description || scenario.description.trim().length < 10) {
      warnings.push('Une description aide les joueurs à choisir votre scénario')
    }
    
    // Validation de la catégorie
    if (!scenario.category) {
      errors.push('Une catégorie doit être sélectionnée')
    }
    
    // Validation de la difficulté
    if (!scenario.difficulty) {
      errors.push('Un niveau de difficulté doit être sélectionné')
    }
    
    // Validation des choix
    if (!scenario.choices || scenario.choices.length === 0) {
      warnings.push('Aucun choix défini - le scénario se terminera immédiatement')
    } else {
      scenario.choices.forEach((choice, index) => {
        if (!choice.text || choice.text.trim().length < 5) {
          errors.push(`Le choix ${index + 1} doit contenir au moins 5 caractères`)
        }
        
        // Vérification des liens de choix
        if (choice.nextScenario === undefined || choice.nextScenario === '') {
          warnings.push(`Le choix ${index + 1} ne mène à aucun scénario suivant`)
        }
      })
    }
    
    // Validation des tags
    if (!scenario.tags || scenario.tags.length === 0) {
      warnings.push('Ajoutez des tags pour améliorer la découvrabilité')
    }
    
    // Validation du temps estimé
    if (!scenario.estimatedTime) {
      warnings.push('Indiquez un temps estimé pour informer les joueurs')
    }
    
    return {
      isValid: errors.length === 0,
      hasWarnings: warnings.length > 0,
      errors,
      warnings,
      score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
    }
  }, [])

  const validateChoice = useCallback((choice, index = 0) => {
    const errors = []
    const warnings = []
    
    if (!choice.text || choice.text.trim().length < 5) {
      errors.push(`Le texte du choix doit contenir au moins 5 caractères`)
    }
    
    if (!choice.consequences || choice.consequences.trim().length < 5) {
      warnings.push(`Ajoutez une description des conséquences pour le choix`)
    }
    
    // Validation des requirements JSON
    if (choice.requirements) {
      try {
        if (typeof choice.requirements === 'string') {
          JSON.parse(choice.requirements)
        }
      } catch (err) {
        errors.push(`Les conditions requises doivent être au format JSON valide`)
      }
    }
    
    // Validation des effects JSON
    if (choice.effects) {
      try {
        if (typeof choice.effects === 'string') {
          JSON.parse(choice.effects)
        }
      } catch (err) {
        errors.push(`Les effets doivent être au format JSON valide`)
      }
    }
    
    // Validation du pourcentage de succès
    if (choice.successChance < 0 || choice.successChance > 100) {
      errors.push(`Le pourcentage de succès doit être entre 0 et 100`)
    } else if (choice.successChance < 50) {
      warnings.push(`Pourcentage de succès faible (${choice.successChance}%)`)
    }
    
    return {
      isValid: errors.length === 0,
      hasWarnings: warnings.length > 0,
      errors,
      warnings
    }
  }, [])

  return {
    validateScenario,
    validateChoice
  }
}

// Hook pour les statistiques des scénarios
export const useScenarioStats = () => {
  const { userScenarios } = useScenarioContext()
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    categories: {},
    difficulties: {},
    averageChoices: 0,
    totalWords: 0,
    topTags: [],
    recentActivity: []
  })

  useEffect(() => {
    if (userScenarios && userScenarios.length > 0) {
      const newStats = {
        total: userScenarios.length,
        published: userScenarios.filter(s => s.isPublic).length,
        draft: userScenarios.filter(s => !s.isPublic).length,
        categories: {},
        difficulties: {},
        averageChoices: 0,
        totalWords: 0,
        topTags: [],
        recentActivity: []
      }

      // Statistiques par catégorie
      userScenarios.forEach(scenario => {
        if (scenario.category) {
          newStats.categories[scenario.category] = (newStats.categories[scenario.category] || 0) + 1
        }
        if (scenario.difficulty) {
          newStats.difficulties[scenario.difficulty] = (newStats.difficulties[scenario.difficulty] || 0) + 1
        }
      })

      // Moyenne des choix
      const totalChoices = userScenarios.reduce((acc, s) => acc + (s.choices?.length || 0), 0)
      newStats.averageChoices = userScenarios.length > 0 ? Math.round(totalChoices / userScenarios.length * 10) / 10 : 0

      // Total des mots
      newStats.totalWords = userScenarios.reduce((acc, s) => {
        const titleWords = s.title ? s.title.split(/\s+/).length : 0
        const textWords = s.text ? s.text.split(/\s+/).length : 0
        const descWords = s.description ? s.description.split(/\s+/).length : 0
        const choicesWords = s.choices ? s.choices.reduce((choiceAcc, choice) => 
          choiceAcc + (choice.text ? choice.text.split(/\s+/).length : 0), 0) : 0
        return acc + titleWords + textWords + descWords + choicesWords
      }, 0)

      // Top tags
      const tagCount = {}
      userScenarios.forEach(scenario => {
        scenario.tags?.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      })
      newStats.topTags = Object.entries(tagCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }))

      // Activité récente
      newStats.recentActivity = userScenarios
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5)
        .map(scenario => ({
          id: scenario.id,
          title: scenario.title,
          action: scenario.updatedAt !== scenario.createdAt ? 'updated' : 'created',
          date: scenario.updatedAt || scenario.createdAt
        }))

      setStats(newStats)
    }
  }, [userScenarios])

  const getProductivityStats = useCallback(() => {
    const now = new Date()
    const thisWeek = userScenarios.filter(s => {
      const created = new Date(s.createdAt)
      const diffTime = Math.abs(now - created)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    }).length

    const thisMonth = userScenarios.filter(s => {
      const created = new Date(s.createdAt)
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length

    return {
      thisWeek,
      thisMonth,
      averagePerWeek: Math.round(stats.total / Math.max(1, Math.ceil((now - new Date(Math.min(...userScenarios.map(s => new Date(s.createdAt))))) / (1000 * 60 * 60 * 24 * 7))))
    }
  }, [userScenarios, stats.total])

  return {
    ...stats,
    getProductivityStats
  }
}

// Hook pour la recherche et le filtrage avancé
export const useScenarioSearch = () => {
  const { userScenarios, filters, setFilters } = useScenarioContext()
  const [searchResults, setSearchResults] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Fonction de recherche avancée
  const advancedSearch = useCallback((searchParams) => {
    setIsSearching(true)
    
    const {
      query = '',
      categories = [],
      difficulties = [],
      tags = [],
      dateRange = null,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
      minWords = 0,
      maxWords = Infinity,
      hasChoices = null,
      isPublished = null
    } = searchParams

    let results = [...userScenarios]

    // Filtrage par texte avec recherche fuzzy
    if (query.trim()) {
      const queryLower = query.toLowerCase()
      const queryTerms = queryLower.split(/\s+/)
      
      results = results.filter(scenario => {
        const searchText = [
          scenario.title || '',
          scenario.description || '',
          scenario.text || '',
          ...(scenario.tags || [])
        ].join(' ').toLowerCase()

        return queryTerms.every(term => searchText.includes(term))
      })
    }

    // Filtrage par catégories  
    if (categories.length > 0) {
      results = results.filter(scenario => categories.includes(scenario.category))
    }

    // Filtrage par difficultés
    if (difficulties.length > 0) {
      results = results.filter(scenario => difficulties.includes(scenario.difficulty))
    }

    // Filtrage par tags
    if (tags.length > 0) {
      results = results.filter(scenario => 
        scenario.tags?.some(tag => tags.includes(tag))
      )
    }

    // Filtrage par date
    if (dateRange && dateRange.start && dateRange.end) {
      const { start, end } = dateRange
      results = results.filter(scenario => {
        const scenarioDate = new Date(scenario.updatedAt || scenario.createdAt)
        return scenarioDate >= start && scenarioDate <= end
      })
    }

    // Filtrage par nombre de mots
    if (minWords > 0 || maxWords < Infinity) {
      results = results.filter(scenario => {
        const wordCount = (scenario.text || '').split(/\s+/).length
        return wordCount >= minWords && wordCount <= maxWords
      })
    }

    // Filtrage par présence de choix
    if (hasChoices !== null) {
      results = results.filter(scenario => {
        const hasChoicesValue = scenario.choices && scenario.choices.length > 0
        return hasChoices ? hasChoicesValue : !hasChoicesValue
      })
    }

    // Filtrage par statut de publication
    if (isPublished !== null) {
      results = results.filter(scenario => Boolean(scenario.isPublic) === isPublished)
    }

    // Tri des résultats
    results.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'title') {
        aValue = aValue?.toLowerCase() || ''
        bValue = bValue?.toLowerCase() || ''
      } else if (sortBy === 'wordCount') {
        aValue = (a.text || '').split(/\s+/).length
        bValue = (b.text || '').split(/\s+/).length
      } else if (sortBy === 'choiceCount') {
        aValue = a.choices?.length || 0
        bValue = b.choices?.length || 0
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1
      } else {
        return aValue > bValue ? 1 : -1
      }
    })

    setSearchResults(results)
    setIsSearching(false)
    
    // Ajouter à l'historique si c'est une vraie recherche
    if (query.trim()) {
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 10)
        localStorage.setItem('scenario_search_history', JSON.stringify(newHistory))
        return newHistory
      })
    }

    return results
  }, [userScenarios])

  // Recherche rapide
  const quickSearch = useCallback((query) => {
    return advancedSearch({ query })
  }, [advancedSearch])

  // Suggestions de recherche
  const getSearchSuggestions = useCallback((query) => {
    if (!query || query.length < 2) return []
    
    const suggestions = []
    const queryLower = query.toLowerCase()
    
    // Suggestions basées sur les titres
    userScenarios.forEach(scenario => {
      if (scenario.title?.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'title',
          text: scenario.title,
          scenario: scenario
        })
      }
    })
    
    // Suggestions basées sur les tags
    const allTags = [...new Set(userScenarios.flatMap(s => s.tags || []))]
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'tag',
          text: `#${tag}`,
          tag: tag
        })
      }
    })
    
    return suggestions.slice(0, 8)
  }, [userScenarios])

  // Charger l'historique de recherche au démarrage
  useEffect(() => {
    const savedHistory = localStorage.getItem('scenario_search_history')
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch (err) {
        console.error('Erreur lors du chargement de l\'historique:', err)
      }
    }
  }, [])

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem('scenario_search_history')
  }, [])

  return {
    searchResults,
    searchHistory,
    isSearching,
    advancedSearch,
    quickSearch,
    getSearchSuggestions,
    clearSearchHistory,
    filters,
    setFilters
  }
}

// Hook pour l'import/export de scénarios
export const useScenarioImportExport = () => {
  const { exportScenarios, importScenarios } = useScenarioContext()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [importProgress, setImportProgress] = useState(0)

  const exportWithProgress = useCallback(async (scenarioIds = null, format = 'json') => {
    setIsExporting(true)
    setExportProgress(0)
    
    try {
      // Simulation du progrès
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90))
      }, 100)
      
      await exportScenarios(scenarioIds)
      
      clearInterval(progressInterval)
      setExportProgress(100)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
      }, 1000)
    }
  }, [exportScenarios])

  const importWithProgress = useCallback(async (file) => {
    setIsImporting(true)
    setImportProgress(0)
    
    try {
      // Simulation du progrès
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 15, 90))
      }, 150)
      
      const count = await importScenarios(file)
      
      clearInterval(progressInterval)
      setImportProgress(100)
      
      return { success: true, count }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setTimeout(() => {
        setIsImporting(false)
        setImportProgress(0)
      }, 1000)
    }
  }, [importScenarios])

  const exportToFormat = useCallback(async (scenarios, format = 'json') => {
    switch (format) {
      case 'json':
        return exportWithProgress(scenarios.map(s => s.id))
      case 'txt':
        // Export en format texte simple
        const textContent = scenarios.map(s => 
          `=== ${s.title} ===\n\n${s.text}\n\nChoix:\n${s.choices?.map((c, i) => `${i + 1}. ${c.text}`).join('\n') || 'Aucun choix'}\n\n`
        ).join('\n---\n\n')
        
        const blob = new Blob([textContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `scenarios-${Date.now()}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        return { success: true }
      default:
        throw new Error('Format non supporté')
    }
  }, [exportWithProgress])

  return {
    exportWithProgress,
    importWithProgress,
    exportToFormat,
    isExporting,
    isImporting,
    exportProgress,
    importProgress
  }
}

// Hook principal qui combine tous les autres
export const useScenarioHook = () => {
  const scenarioManager = useScenarioManager()
  const validation = useScenarioValidation()
  const stats = useScenarioStats()
  const search = useScenarioSearch()
  const importExport = useScenarioImportExport()

  return {
    // Gestion des scénarios
    ...scenarioManager,
    
    // Validation
    validateScenario: validation.validateScenario,
    validateChoice: validation.validateChoice,
    
    // Statistiques
    stats,
    
    // Recherche
    search: search.advancedSearch,
    quickSearch: search.quickSearch,
    searchResults: search.searchResults,
    searchHistory: search.searchHistory,
    getSearchSuggestions: search.getSearchSuggestions,
    clearSearchHistory: search.clearSearchHistory,
    
    // Import/Export
    exportScenarios: importExport.exportWithProgress,
    importScenarios: importExport.importWithProgress,
    exportToFormat: importExport.exportToFormat,
    isExporting: importExport.isExporting,
    isImporting: importExport.isImporting
  }
}

// Export par défaut pour l'utilisation simple
export default useScenarioHook