import React from 'react'
import Header from './Header'
import Footer from './Footer'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout