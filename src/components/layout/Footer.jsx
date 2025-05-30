import React from 'react'

function Footer() {
  return (
    <footer className="bg-amber-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent mb-4">
              VEH
            </h3>
            <p className="text-amber-200">
              Votre Épopée Héroïque - L'aventure narrative réinventée
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Produit</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Prix</a></li>
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Communauté</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Forum</a></li>
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Discord</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Conditions</a></li>
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Confidentialité</a></li>
              <li><a href="#" className="text-amber-300 hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-yellow-700 pt-8 text-center text-amber-300">
          <p>&copy; 2024 VEH. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer