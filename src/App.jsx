import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ScenarioProvider } from './contexts/ScenarioContext'
import LoadingScreen from './components/common/LoadingScreen'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreatorStudio from './pages/CreatorStudio'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ScenarioProvider>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/creator" element={<CreatorStudio />} />

              {/* Protected routes (commented out) */}
              {/*
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator" 
                element={
                  <ProtectedRoute>
                    <CreatorStudio />
                  </ProtectedRoute>
                } 
              />
              */}
            </Routes>
          </Suspense>
        </Router>
      </ScenarioProvider>
    </AuthProvider>
  )
}

export default App