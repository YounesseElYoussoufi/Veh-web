import React from 'react'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-red-900 to-amber-800 flex items-center justify-center z-50 overflow-hidden">
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Cercles décoratifs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-yellow-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-amber-500 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="text-center relative z-10">
        {/* Icône héroïque animée */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Bouclier principal */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-yellow-600 via-amber-700 to-red-800 rounded-full transform transition-all duration-1000"
              style={{
                animation: 'heroGlow 3s infinite ease-in-out',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Étoile centrale */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-12 h-12 text-yellow-200"
                  style={{animation: 'starRotate 4s linear infinite'}}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Anneaux pulsants */}
            <div 
              className="absolute -inset-4 border-4 border-yellow-500 rounded-full opacity-40"
              style={{animation: 'ringPulse 2s infinite ease-in-out'}}
            ></div>
            <div 
              className="absolute -inset-8 border-2 border-amber-400 rounded-full opacity-20"
              style={{animation: 'ringPulse 2s infinite ease-in-out 0.5s'}}
            ></div>
          </div>
        </div>

        {/* Texte héroïque */}
        <div className="space-y-4">
          <h1 
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-600 mb-2"
            style={{
              animation: 'textGlow 2s infinite ease-in-out',
              textShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
            }}
          >
            VOUS ÊTES LE HÉROS
          </h1>
          
          <div className="flex items-center justify-center space-x-2 text-amber-200">
            <div 
              className="w-3 h-3 bg-yellow-500 rounded-full"
              style={{animation: 'dot1 1.5s infinite ease-in-out'}}
            ></div>
            <div 
              className="w-3 h-3 bg-yellow-500 rounded-full"
              style={{animation: 'dot2 1.5s infinite ease-in-out'}}
            ></div>
            <div 
              className="w-3 h-3 bg-yellow-500 rounded-full"
              style={{animation: 'dot3 1.5s infinite ease-in-out'}}
            ></div>
          </div>
          
      
        </div>
      </div>

      {/* Styles CSS intégrés */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes heroGlow {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            box-shadow: 0 0 30px rgba(245, 158, 11, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3);
          }
          50% { 
            transform: scale(1.1) rotate(180deg);
            box-shadow: 0 0 50px rgba(245, 158, 11, 0.8), inset 0 0 30px rgba(0, 0, 0, 0.4);
          }
        }
        
        @keyframes starRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ringPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.1;
          }
        }
        
        @keyframes textGlow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
          }
          50% { 
            text-shadow: 0 0 30px rgba(245, 158, 11, 0.8), 0 0 40px rgba(245, 158, 11, 0.3);
          }
        }
        
        @keyframes dot1 {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes dot2 {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes dot3 {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        
        .animate-dot1 { animation-delay: 0s; }
        .animate-dot2 { animation-delay: 0.3s; }
        .animate-dot3 { animation-delay: 0.6s; }
      `}</style>
    </div>
  )
}

export default LoadingScreen