import React from 'react'
import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}) => {
  // Variants de style
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25',
    secondary: 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20',
    outline: 'bg-transparent text-purple-400 border-2 border-purple-400 hover:bg-purple-400 hover:text-white',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/10',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/25',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg hover:shadow-green-500/25',
  }

  // Tailles
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }

  // Classes de base
  const baseClasses = `
    font-bold rounded-full transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : 'inline-flex'}
    items-center justify-center gap-2
  `

  // Combinaison des classes
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e)
    }
  }

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Chargement...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="text-lg">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="text-lg">{icon}</span>}
        </>
      )}
    </motion.button>
  )
}

// Composants spécialisés pour des cas d'usage fréquents
export const PrimaryButton = (props) => <Button variant="primary" {...props} />
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />
export const OutlineButton = (props) => <Button variant="outline" {...props} />
export const GhostButton = (props) => <Button variant="ghost" {...props} />
export const DangerButton = (props) => <Button variant="danger" {...props} />
export const SuccessButton = (props) => <Button variant="success" {...props} />

// Boutons avec icônes prédéfinies
export const LoginButton = (props) => (
  <Button variant="primary" icon="🔓" {...props}>
    Se connecter
  </Button>
)

export const RegisterButton = (props) => (
  <Button variant="secondary" icon="✨" {...props}>
    S'inscrire
  </Button>
)

export const PlayButton = (props) => (
  <Button variant="primary" icon="🎮" {...props}>
    Jouer
  </Button>
)

export const CreateButton = (props) => (
  <Button variant="outline" icon="✍️" {...props}>
    Créer
  </Button>
)

export default Button