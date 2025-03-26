import type { Metadata } from "next"
import Header from "@/app/comp/Header"
import Footer from "@/app/comp/Footer"
import HeroSection from "@/app/landing/HeroSection"
import FeaturesSection from "@/app/landing/FeaturesSection"
import HowItWorksSection from "@/app/landing/HowItWorksSection"

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

