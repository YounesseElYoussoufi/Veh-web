import React, { useState } from 'react'

function GamePreview() {
  const [currentChoice, setCurrentChoice] = useState(0)
  
  const story = {
    title: "Le Mystère de la Tour Oubliée",
    text: "Vous vous trouvez devant une ancienne tour mystérieuse, entourée d'une brume épaisse. La porte semble fermée, mais vous remarquez une fenêtre entrouverte au premier étage et un passage souterrain à moitié caché par la végétation.",
    choices: [
      "Forcer la porte principale",
      "Escalader jusqu'à la fenêtre",
      "Explorer le passage souterrain"
    ]
  }

  return (
    <section className="py-20 px-6 bg-amber-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-white mb-4">
          Essayez Maintenant
        </h2>
        <p className="text-xl text-center text-amber-200 mb-12">
          Découvrez l'expérience VEH avec cet extrait interactif
        </p>
        
        <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-yellow-600/30 transform transition-all duration-500 hover:scale-[1.01]">
          <h3 className="text-3xl font-bold text-yellow-300 mb-6">{story.title}</h3>
          
          <p className="text-lg text-amber-100 mb-8 leading-relaxed">
            {story.text}
          </p>
          
          <div className="space-y-4">
            <p className="text-yellow-400 font-semibold mb-4">Que faites-vous ?</p>
            {story.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => setCurrentChoice(index)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  currentChoice === index 
                    ? 'bg-gradient-to-r from-yellow-700 to-amber-700 text-white shadow-lg shadow-yellow-600/25' 
                    : 'bg-white/5 text-amber-200 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{index + 1}. {choice}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-yellow-700 to-amber-700 text-white font-bold rounded-full hover:shadow-lg hover:shadow-yellow-600/25 transition-all duration-300 transform hover:scale-105">
              Continuer l'Aventure Complète
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GamePreview