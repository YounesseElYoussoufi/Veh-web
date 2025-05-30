import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

function FeaturesSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const features = [
    {
      icon: "📖",
      title: "Histoires Immersives",
      description: "Des récits captivants avec des choix multiples qui influencent le déroulement de l'histoire"
    },
    {
      icon: "🎭",
      title: "Personnages Vivants",
      description: "Créez votre héros unique avec des caractéristiques et compétences personnalisables"
    },
    {
      icon: "🗺️",
      title: "Mondes Expansifs",
      description: "Explorez des univers riches et détaillés, du médiéval fantastique au futuriste"
    },
    {
      icon: "✍️",
      title: "Créateur de Scénarios",
      description: "Devenez auteur et partagez vos propres aventures avec la communauté"
    },
    {
      icon: "🏆",
      title: "Système de Progression",
      description: "Gagnez de l'expérience, débloquez des compétences et collectionnez des récompenses"
    },
    {
      icon: "👥",
      title: "Communauté Active",
      description: "Jouez, créez et partagez avec des milliers de passionnés d'aventures narratives"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section id="features" className="py-20 px-6 bg-amber-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Fonctionnalités Magiques
          </h2>
          <p className="text-xl text-amber-300 max-w-3xl mx-auto">
            VEH réinvente l'expérience des livres-jeux avec des fonctionnalités innovantes
          </p>
        </motion.div>
        
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-amber-900/20 to-yellow-800/20 backdrop-blur-lg rounded-2xl p-8 border border-amber-600/20 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-600/20"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-amber-200">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection