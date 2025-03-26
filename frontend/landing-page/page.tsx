import type { Metadata } from "next"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeaturesSection"
import HowItWorksSection from "./components/HowItWorksSection"

export const metadata: Metadata = {
  title: "SUMA - Interactive Sessions",
  description: "Create and join interactive sessions with polls and MCQs",
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showNavLinks={true} />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  )
}

