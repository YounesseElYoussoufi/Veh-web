import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

function HowItWorksSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const steps = [
    { number: "01", title: "Choisissez votre aventure", desc: "Parcourez notre bibliothèque ou créez la vôtre" },
    { number: "02", title: "Créez votre personnage", desc: "Personnalisez vos attributs et compétences" },
    { number: "03", title: "Faites vos choix", desc: "Chaque décision influence votre parcours" },
    { number: "04", title: "Vivez l'épopée", desc: "Découvrez des fins multiples et rejouez différemment" }
  ]

  return (
    <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-amber-900 to-yellow-900">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center text-white mb-16"
        >
          Comment ça marche ?
        </motion.h2>
        
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-700 to-amber-700 transform -translate-y-1/2 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="bg-amber-800 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center border-4 border-yellow-600 relative z-10">
                  <span className="text-3xl font-bold text-yellow-400">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-amber-200">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection