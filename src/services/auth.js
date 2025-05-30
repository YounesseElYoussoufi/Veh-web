import api from './api'

const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion')
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription')
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw new Error('Impossible de récupérer les informations utilisateur')
    }
  },

  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      return response.data
    } catch (error) {
      throw new Error('Impossible de rafraîchir le token')
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Continue même en cas d'erreur côté serveur
      console.error('Erreur lors de la déconnexion:', error)
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi du lien de réinitialisation')
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await api.post('/auth/reset-password', { token, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe')
    }
  }
}

export default authService