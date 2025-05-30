import React, { Suspense } from 'react'
import Layout from '../components/layout/Layout'
import HeroSection from '../components/landing/Hero'
import FeaturesSection from '../components/landing/Features'
import HowItWorksSection from '../components/landing/HowItWorks'
import GamePreview from '../components/landing/GamePreview'
import CTASection from '../components/landing/CallToAction'
import LoadingScreen from '../components/common/LoadingScreen'
import DownloadSection from '../components/landing/DownloadSection'
function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Layout>
        <HeroSection />
        <FeaturesSection />
        <GamePreview />
        <HowItWorksSection />

         <DownloadSection />
        <CTASection />
      </Layout>
    </Suspense>
  )
}

export default Home