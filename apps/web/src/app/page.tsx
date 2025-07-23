'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ComparisonSection from '@/components/sections/ComparisonSection'
import ProcessSection from '@/components/sections/ProcessSection'
import LaunchPrepSection from '@/components/sections/LaunchPrepSection'
import PhilosophySection from '@/components/sections/PhilosophySection'
import StackSection from '@/components/sections/StackSection'
import WhatWeDontDoSection from '@/components/sections/WhatWeDontDoSection'
import PricingSection from '@/components/sections/PricingSection'
import PostDeliverySection from '@/components/sections/PostDeliverySection'
import CatchSection from '@/components/sections/CatchSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalCTASection from '@/components/sections/FinalCTASection'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <ComparisonSection />
        <ProcessSection />
        <LaunchPrepSection />
        <PhilosophySection />
        <StackSection />
        <WhatWeDontDoSection />
        <PricingSection />
        <PostDeliverySection />
        <CatchSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}