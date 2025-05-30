// Données constantes pour les scénarios
export const scenarios = [
  {
    id: 0,
    title: "Le Commencement",
    text: "Vous vous réveillez dans une chambre obscure, éclairée seulement par quelques bougies vacillantes. Une porte en bois massif se trouve devant vous, et vous entendez des bruits étranges de l'autre côté.",
    choices: [
      { 
        id: 'a', 
        text: "Ouvrir la porte avec précaution", 
        nextScenario: 1,
        consequences: "Vous entrez dans le couloir sombre"
      },
      { 
        id: 'b', 
        text: "Chercher une arme dans la chambre d'abord", 
        nextScenario: 2,
        consequences: "Vous trouvez des objets mystérieux"
      },
      { 
        id: 'c', 
        text: "Appeler à l'aide", 
        nextScenario: 3,
        consequences: "Quelqu'un répond à votre appel"
      },
      { 
        id: 'd', 
        text: "Examiner la pièce plus en détail", 
        nextScenario: 4,
        consequences: "Vous découvrez des secrets cachés"
      }
    ]
  },
  {
    id: 1,
    title: "Le Couloir",
    text: "Vous ouvrez la porte et découvrez un long couloir sombre. Des torches sont accrochées aux murs, projetant des ombres inquiétantes. Au loin, vous entendez ce qui ressemble à une conversation.",
    choices: [
      { 
        id: 'a', 
        text: "Avancer silencieusement vers les voix", 
        nextScenario: 5,
        consequences: "Vous écoutez la conversation"
      },
      { 
        id: 'b', 
        text: "Prendre une torche et explorer le couloir", 
        nextScenario: 6,
        consequences: "Vous explorez avec la lumière"
      },
      { 
        id: 'c', 
        text: "Retourner dans la chambre", 
        nextScenario: 0,
        consequences: "Vous revenez sur vos pas"
      },
      { 
        id: 'd', 
        text: "Appeler pour attirer l'attention", 
        nextScenario: 7,
        consequences: "Vous attirez l'attention des gardes"
      }
    ]
  },
  {
    id: 2,
    title: "À la recherche d'une arme",
    text: "Vous cherchez dans la chambre et trouvez un vieux coffre sous le lit. À l'intérieur, il y a une dague ornée et une petite fiole contenant un liquide bleu luminescent.",
    choices: [
      { 
        id: 'a', 
        text: "Prendre la dague et ouvrir la porte", 
        nextScenario: 1,
        consequences: "Vous êtes maintenant armé"
      },
      { 
        id: 'b', 
        text: "Examiner la fiole de plus près", 
        nextScenario: 8,
        consequences: "La fiole révèle ses secrets"
      },
      { 
        id: 'c', 
        text: "Prendre les deux objets et ouvrir la porte", 
        nextScenario: 9,
        consequences: "Vous êtes bien équipé"
      },
      { 
        id: 'd', 
        text: "Continuer à chercher d'autres objets utiles", 
        nextScenario: 10,
        consequences: "Vous trouvez des objets plus précieux"
      }
    ]
  },
  // Ajoutez plus de scénarios selon vos besoins...
]

// Scénarios disponibles pour les créateurs
export const availableScenarios = [
  {
    id: 'forest',
    title: "La Forêt des Murmures",
    description: "Explorez une forêt ancienne où les arbres murmurent des secrets et où des créatures mythiques se cachent dans l'ombre.",
    difficulty: 'Facile',
    category: 'Aventure',
    startScenario: 0,
    estimatedTime: '30-45 min',
    image: '/images/forest.jpg',
    tags: ['nature', 'mystère', 'créatures']
  },
  {
    id: 'castle',
    title: "Le Château des Illusions",
    description: "Naviguez à travers un château où rien n'est comme il semble. Chaque porte pourrait mener à un piège ou à un trésor.",
    difficulty: 'Moyen',
    category: 'Mystère',
    startScenario: 40,
    estimatedTime: '45-60 min',
    image: '/images/castle.jpg',
    tags: ['château', 'illusion', 'piège']
  },
  {
    id: 'catacombs',
    title: "Les Catacombes Oubliées",
    description: "Descendez dans d'anciennes catacombes remplies de pièges mortels, d'énigmes complexes et de secrets ensevelis depuis des siècles.",
    difficulty: 'Difficile',
    category: 'Horreur',
    startScenario: 80,
    estimatedTime: '60-90 min',
    image: '/images/catacombs.jpg',
    tags: ['catacombes', 'horreur', 'énigmes']
  },
  {
    id: 'kingdom',
    title: "Le Royaume Divisé",
    description: "Entrez dans un royaume au bord de la guerre civile. Vos choix détermineront le destin de nations entières.",
    difficulty: 'Moyen',
    category: 'Politique',
    startScenario: 120,
    estimatedTime: '90-120 min',
    image: '/images/kingdom.jpg',
    tags: ['royaume', 'guerre', 'politique']
  }
]

// Catégories de scénarios
export const scenarioCategories = [
  'Aventure',
  'Mystère',
  'Horreur',
  'Romance',
  'Science-Fiction',
  'Fantasy',
  'Politique',
  'Action',
  'Comédie',
  'Drame'
]

// Niveaux de difficulté
export const difficultyLevels = [
  { value: 'Facile', color: 'green', description: 'Parfait pour débuter' },
  { value: 'Moyen', color: 'yellow', description: 'Quelques défis' },
  { value: 'Difficile', color: 'red', description: 'Pour les experts' }
]