// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    minLength: password.length >= 8
  }
}

// Username validation
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return {
    isValid: usernameRegex.test(username),
    minLength: username.length >= 3,
    maxLength: username.length <= 20,
    validChars: /^[a-zA-Z0-9_-]+$/.test(username)
  }
}

// Form validation helpers
export const getPasswordStrength = (password) => {
  const validation = validatePassword(password)
  let strength = 0
  
  if (validation.minLength) strength++
  if (validation.hasUpperCase) strength++
  if (validation.hasLowerCase) strength++
  if (validation.hasNumbers) strength++
  if (validation.hasSpecialChar) strength++
  
  if (strength <= 2) return { level: 'weak', color: 'red', text: 'Faible' }
  if (strength <= 3) return { level: 'medium', color: 'yellow', text: 'Moyen' }
  if (strength <= 4) return { level: 'good', color: 'blue', text: 'Bon' }
  return { level: 'strong', color: 'green', text: 'Fort' }
}

export const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '')
}