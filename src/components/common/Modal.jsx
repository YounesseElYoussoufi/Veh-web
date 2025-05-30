import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdrop = true,
  showCloseButton = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
}) => {
  // Tailles du modal
  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    fullscreen: 'max-w-full mx-4',
  }

  // Fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Gestion du clic sur le backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose()
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`
              relative bg-gray-900 rounded-2xl shadow-2xl border border-white/20
              ${sizes[size]} w-full max-h-[90vh] overflow-hidden
              ${className}
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={`
                flex items-center justify-between p-6 border-b border-white/10
                ${headerClassName}
              `}>
                {title && (
                  <h2 className="text-2xl font-bold text-white">{title}</h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    aria-label="Fermer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className={`
              p-6 overflow-y-auto max-h-[calc(90vh-120px)]
              ${bodyClassName}
            `}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className={`
                p-6 border-t border-white/10 bg-gray-800/50
                ${footerClassName}
              `}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  // Utilisation de createPortal pour rendre le modal à la racine
  return createPortal(modalContent, document.body)
}

// Hook personnalisé pour gérer l'état du modal
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  const toggleModal = () => setIsOpen(!isOpen)

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  }
}

// Composants spécialisés
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmation", 
  message, 
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger"
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const confirmButtonClass = variant === 'danger' 
    ? 'bg-red-600 hover:bg-red-700' 
    : 'bg-purple-600 hover:bg-purple-700'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-gray-300">{message}</p>
    </Modal>
  )
}

export const AlertModal = ({ 
  isOpen, 
  onClose, 
  title = "Information", 
  message, 
  type = "info" 
}) => {
  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌"
  }

  const colors = {
    info: "text-blue-400",
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-400"
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icons[type]}</span>
          <span className={colors[type]}>{title}</span>
        </div>
      }
      size="small"
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      }
    >
      <p className="text-gray-300">{message}</p>
    </Modal>
  )
}

export default Modal