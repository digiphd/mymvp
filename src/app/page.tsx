import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ComparisonSection from '@/components/sections/ComparisonSection'
import ProcessSection from '@/components/sections/ProcessSection'
import PhilosophySection from '@/components/sections/PhilosophySection'
import WhatWeDontDoSection from '@/components/sections/WhatWeDontDoSection'
import PricingSection from '@/components/sections/PricingSection'
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
        <PhilosophySection />
        <WhatWeDontDoSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}