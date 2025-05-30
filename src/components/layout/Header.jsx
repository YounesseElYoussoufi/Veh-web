import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Accueil', href: '#home' },
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Comment ça marche', href: '#how-it-works' },
    { name: 'Communauté', href: '#community' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-amber-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-800 bg-clip-text text-transparent"
            >
              VEH
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-amber-300 hover:text-white transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard"
                  className="text-amber-300 hover:text-white transition-colors"
                >
                  Tableau de bord
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 text-sm">
                    Bonjour, {user?.username || 'Héros'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-full text-sm transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login"
                  className="text-amber-300 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
                <Link to="/register">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-800 text-white rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                  >
                    S'inscrire
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2 text-amber-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            {isAuthenticated ? (
              <div className="mt-4 space-y-2">
                <Link 
                  to="/dashboard"
                  className="block py-2 text-amber-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tableau de bord
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Link 
                  to="/login" 
                  className="block py-2 text-amber-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-800 text-white rounded-full">
                    S'inscrire
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </nav>
    </header>
  )
}

export default Header