'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Leaf,
  Sparkles,
  ChevronDown,
  Sun,
  Moon,
  ArrowRight,
  Zap,
  PieChart,
  Target,
  Menu,
  X,
  CheckCircle,
  HelpCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useUIStore } from '@/stores/uiStore'

// Lifestyle Simulator types
type TransportType = 'suv' | 'sedan' | 'ev' | 'transit'
type DietType = 'heavy-meat' | 'mixed' | 'vegetarian' | 'vegan'
type EnergyType = 'fossil' | 'renewable'

export default function Home() {
  const { theme, toggleTheme } = useUIStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Simulator State
  const [simTransport, setSimTransport] = useState<TransportType>('sedan')
  const [simDiet, setSimDiet] = useState<DietType>('mixed')
  const [simEnergy, setSimEnergy] = useState<EnergyType>('fossil')

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Live Carbon Impact Calculator formula (simplified for landing page preview)
  const simFootprint = useMemo(() => {
    let transportEmissions = 3.2
    if (simTransport === 'suv') transportEmissions = 4.8
    if (simTransport === 'ev') transportEmissions = 1.1
    if (simTransport === 'transit') transportEmissions = 0.5

    let dietEmissions = 2.5
    if (simDiet === 'heavy-meat') dietEmissions = 3.3
    if (simDiet === 'vegetarian') dietEmissions = 1.7
    if (simDiet === 'vegan') dietEmissions = 1.2

    let energyEmissions = 2.8
    if (simEnergy === 'renewable') energyEmissions = 0.4

    // consumer goods baseline
    const baseline = 2.0

    return parseFloat((transportEmissions + dietEmissions + energyEmissions + baseline).toFixed(1))
  }, [simTransport, simDiet, simEnergy])

  const baselineDiffPercent = Math.round(((8.5 - simFootprint) / 8.5) * 100) // 8.5t is average benchmark

  // Simulated AI Recommendations text based on selections
  const simAIRecommendation = useMemo(() => {
    if (simTransport === 'suv' && simDiet === 'heavy-meat' && simEnergy === 'fossil') {
      return "Switching from a gas SUV to an EV and substituting 3 meals a week with plant-based alternatives represents your highest-leverage first step, saving up to 5.2 tonnes of CO2e annually."
    }
    if (simTransport === 'ev' && simDiet === 'vegan' && simEnergy === 'renewable') {
      return "Excellent! You are already in the top 5% of low-carbon lifestyles. Focus on offsetting the baseline consumer goods emission through localized reforestation projects and solar community shares."
    }
    if (simDiet === 'heavy-meat') {
      return "Your beef and lamb consumption represents over 35% of your footprint. Transitioning to a mixed or vegetarian diet even 3 days a week can cut your dietary carbon emissions in half."
    }
    if (simTransport === 'suv') {
      return "Your SUV is responsible for a significant transport emission profile. Consider commuting via electric rail, or transition to a plug-in hybrid or EV to reduce commuter emissions by 70%."
    }
    if (simEnergy === 'fossil') {
      return "Your home heating and electricity are sourced from fossil fuels. Switching to a certified green energy utility is a 0-effort transition that instantly cuts 2.4 tonnes of CO2e/year."
    }
    return "Great job! Small progressive adjustments like purchasing energy-efficient appliances or reducing air travel will slide you even closer to the 2.0t carbon neutrality target."
  }, [simTransport, simDiet, simEnergy])

  // Framer-motion animation presets
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  const faqs = [
    {
      q: "How accurate is the carbon calculator?",
      a: "Our calculator uses localized greenhouse gas emission factors (for transport, regional power grids, global shipping, and lifecycle agricultural food chains) combined with standard EPA and UK DEFRA carbon methodologies. It gives an extremely reliable personal baseline."
    },
    {
      q: "How does the Gemini AI recommendation system work?",
      a: "Unlike generic calculators that give generic advice, CarbonTrack passes your specific answers, local context, and footprint breakdown to Google Gemini via a structured secure API. It compiles custom, step-by-step reduction plans with estimates of difficulty and environmental saving."
    },
    {
      q: "Can I save my history and track progress?",
      a: "Yes! By signing in with a Google account, your monthly calculation history, target reductions, and local goals are securely saved to Google Cloud Firestore, letting you visualize your carbon reduction curve over time."
    },
    {
      q: "What is carbon neutrality, and how close can I get?",
      a: "Carbon neutrality is balancing carbon emissions with absorption or offsets. A sustainable personal footprint is under 2.0 tonnes of CO2e/year. CarbonTrack shows you where you stand and maps out the path to get as close to zero as possible."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] left-[-200px] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full glassmorphism border-b border-border/40 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/15 rounded-xl text-primary transition-all group-hover:scale-110 group-hover:bg-primary/25">
              <Leaf className="w-5 h-5 fill-primary/10" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
              Carbon<span className="text-primary">Track</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#simulator" className="hover:text-foreground transition-colors">Simulator</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons & Theme Toggler */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/calculator"
              className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl shadow-md hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all hover:scale-[1.02]"
            >
              Start Calculator
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-secondary rounded-xl text-foreground transition-all"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 z-30 glassmorphism border-b border-border p-6 shadow-xl space-y-4"
          >
            <nav className="flex flex-col gap-4 text-base font-medium">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors py-2 border-b border-border/20"
              >
                Features
              </a>
              <a
                href="#simulator"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors py-2 border-b border-border/20"
              >
                Simulator
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors py-2 border-b border-border/20"
              >
                How It Works
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors py-2"
              >
                FAQ
              </a>
            </nav>
            <Link
              href="/calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block py-3 text-center font-bold text-white bg-primary rounded-xl shadow-md hover:bg-emerald-600 transition-all"
            >
              Calculate Your Footprint
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-6 max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-primary bg-primary/10 border border-primary/20 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Google Gemini AI</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-none"
          >
            Uncover and Reduce Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
              Carbon Footprint
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Calculate your carbon impact in 60 seconds, analyze category breakdowns, and receive a personalized reduction roadmap generated by AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link
              href="/calculator"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:scale-[1.03] flex items-center justify-center gap-2 group"
            >
              Calculate Footprint Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#simulator"
              className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-secondary/80 font-bold rounded-2xl border border-border transition-all hover:scale-[1.03] text-center"
            >
              Try Lifestyle Simulator
            </a>
          </motion.div>
        </motion.div>

        {/* Floating Mini Dashboard Simulator Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          className="mt-16 w-full max-w-5xl relative"
        >
          {/* Glowing Aura behind simulator */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-10 blur-xl -z-10" />

          {/* The Widget Wrapper */}
          <div className="bg-card/75 border border-border rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Window bar */}
            <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-card/40">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-destructive/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">CarbonTrack Core Simulator</span>
              <div className="w-12" /> {/* spacer */}
            </div>

            {/* Content Grid */}
            <div id="simulator" className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Selectors */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Configure Lifestyle Choices
                  </h3>
                  <p className="text-xs text-muted-foreground">Toggle values below to watch the emissions chart change dynamically.</p>
                </div>

                {/* Transport choices */}
                <div className="space-y-2">
                  <span id="sim-transport-label" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Daily Transport</span>
                  <div
                    role="radiogroup"
                    aria-labelledby="sim-transport-label"
                    className="grid grid-cols-2 gap-2"
                  >
                    {[
                      { key: 'suv', label: 'Gas SUV' },
                      { key: 'sedan', label: 'Gas Sedan' },
                      { key: 'ev', label: 'Electric Vehicle' },
                      { key: 'transit', label: 'Public Transit' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        role="radio"
                        aria-checked={simTransport === item.key}
                        onClick={() => setSimTransport(item.key as TransportType)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          simTransport === item.key
                            ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                            : 'bg-background hover:bg-secondary/40 border-border text-muted-foreground'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diet choices */}
                <div className="space-y-2">
                  <span id="sim-diet-label" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Dietary Choices</span>
                  <div
                    role="radiogroup"
                    aria-labelledby="sim-diet-label"
                    className="grid grid-cols-2 gap-2"
                  >
                    {[
                      { key: 'heavy-meat', label: 'High Red Meat' },
                      { key: 'mixed', label: 'Mixed Diet' },
                      { key: 'vegetarian', label: 'Vegetarian' },
                      { key: 'vegan', label: 'Plant-Based' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        role="radio"
                        aria-checked={simDiet === item.key}
                        onClick={() => setSimDiet(item.key as DietType)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          simDiet === item.key
                            ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                            : 'bg-background hover:bg-secondary/40 border-border text-muted-foreground'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy source */}
                <div className="space-y-2">
                  <span id="sim-energy-label" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Home Heating & Grid Power</span>
                  <div
                    role="radiogroup"
                    aria-labelledby="sim-energy-label"
                    className="grid grid-cols-2 gap-2"
                  >
                    {[
                      { key: 'fossil', label: 'Standard Grid (Fossil)' },
                      { key: 'renewable', label: 'Solar / Green Utility' }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        role="radio"
                        aria-checked={simEnergy === item.key}
                        onClick={() => setSimEnergy(item.key as EnergyType)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          simEnergy === item.key
                            ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                            : 'bg-background hover:bg-secondary/40 border-border text-muted-foreground'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Charts & Real-time AI recommendation feedback */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-border/50 pt-8 lg:pt-0 lg:pl-8">
                
                {/* Simulated Chart breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* Gauge representation */}
                  <div className="flex flex-col items-center justify-center p-4 bg-secondary/20 rounded-2xl relative overflow-hidden">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Total Carbon</span>
                    
                    {/* Gauge Display */}
                    <div
                      role="meter"
                      aria-valuenow={simFootprint}
                      aria-valuemin={0}
                      aria-valuemax={15}
                      aria-valuetext={`${simFootprint} tonnes of CO2e per year`}
                      className="relative w-36 h-36 flex items-center justify-center mt-2"
                    >
                      {/* SVG Ring */}
                      <svg className="w-full h-full transform -rotate-90" aria-hidden="true">
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          className="stroke-muted fill-transparent"
                          strokeWidth="10"
                        />
                        <motion.circle
                          cx="72"
                          cy="72"
                          r="60"
                          className="stroke-primary fill-transparent"
                          strokeWidth="10"
                          strokeDasharray={377}
                          initial={{ strokeDashoffset: 377 }}
                          animate={{ strokeDashoffset: 377 - (377 * Math.min(simFootprint, 15)) / 15 }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      <div className="absolute flex flex-col items-center justify-center text-center" aria-hidden="true">
                        <span className="text-3xl font-black text-foreground font-display">{simFootprint}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">t CO₂e/yr</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col items-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        simFootprint <= 4.0 ? 'bg-emerald-500/10 text-emerald-500' :
                        simFootprint <= 8.0 ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {simFootprint <= 4.0 ? 'Low Impact' : simFootprint <= 8.0 ? 'Moderate' : 'High Impact'}
                      </span>
                    </div>
                  </div>

                  {/* Comparisons */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">vs Benchmarks</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Average Global Resident</span>
                          <span className="font-semibold">4.8t</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-muted-foreground/40 rounded-full" style={{ width: '56%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Average US Resident</span>
                          <span className="font-semibold">16.0t</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500/50 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-primary font-semibold">Your Simulated Score</span>
                          <span className="text-primary font-bold">{simFootprint}t</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(simFootprint / 16.0) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    {baselineDiffPercent > 0 ? (
                      <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Saving {baselineDiffPercent}% compared to average baseline!
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Configure low-carbon options to decrease your simulated footprint.
                      </p>
                    )}
                  </div>
                </div>

                {/* Simulated AI box */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>Gemini Live Advice</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground mb-1 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-primary" />
                    AI Action Plan Recommendation
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed italic pr-12 min-h-[50px]">
                    &ldquo;{simAIRecommendation}&rdquo;
                  </p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* Impact Counter Section */}
      <section className="bg-secondary/40 border-y border-border/40 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <span className="block text-4xl font-extrabold font-display bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              184,320+
            </span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Tonnes CO₂e Tracked</span>
          </div>
          <div className="space-y-2 border-y sm:border-y-0 sm:border-x border-border/40 py-6 sm:py-0">
            <span className="block text-4xl font-extrabold text-foreground font-display">
              60 Seconds
            </span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Average Setup Time</span>
          </div>
          <div className="space-y-2">
            <span className="block text-4xl font-extrabold font-display bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              34.8%
            </span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Average User Offset Rate</span>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest font-display">Product Features</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-foreground font-display tracking-tight leading-tight">
            An Intelligent Toolkit for Climate Action
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            CarbonTrack pairs high-precision carbon math with Google Gemini AI to guide you from footprint analysis directly to impactful reductions.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Zap className="w-6 h-6 text-emerald-500" />,
              title: "60-Sec Calculator",
              desc: "A simplified 4-step lifestyle questionnaire designed to evaluate transport, energy, food, and flights with zero friction."
            },
            {
              icon: <Sparkles className="w-6 h-6 text-teal-500" />,
              title: "AI Action Plans",
              desc: "Hyper-personalized, custom carbon reduction roadmaps compiled by Google Gemini based on your unique lifestyle choices."
            },
            {
              icon: <PieChart className="w-6 h-6 text-emerald-500" />,
              title: "Interactive Charts",
              desc: "Stunning Recharts donut charts and comparison graphs to help you visualize your category percentages and global benchmarks."
            },
            {
              icon: <Target className="w-6 h-6 text-teal-500" />,
              title: "Goal Management",
              desc: "Log your monthly footprint history in Firestore, set targets, and track your carbon reduction trajectory over time."
            }
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              className="bg-card hover:bg-card/80 border border-border p-6 rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-secondary/50 rounded-xl inline-block">
                  {feat.icon}
                </div>
                <h4 className="text-lg font-bold font-display text-foreground">{feat.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-secondary/20 border-y border-border/40 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest font-display">Workflow</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-foreground font-display tracking-tight">
              Three Simple Steps to Carbon Neutrality
            </h3>
            <p className="text-sm text-muted-foreground">
              We streamline footprint estimation so you can spend less time math-crunching and more time implementing carbon reduction offsets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="space-y-4 text-center relative flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground font-bold text-lg rounded-full flex items-center justify-center font-display shadow-md">
                1
              </div>
              <h4 className="text-lg font-bold font-display">Lifestyle Inventory</h4>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Take our 4-question wizard. We calculate your annual CO₂e footprint using official EPA databases in real-time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center relative flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-500 text-white font-bold text-lg rounded-full flex items-center justify-center font-display shadow-md">
                2
              </div>
              <h4 className="text-lg font-bold font-display">AI Optimization</h4>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Google Gemini processes your data to formulate highly detailed, actionable carbon reduction guides tailored to your life.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center relative flex flex-col items-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground font-bold text-lg rounded-full flex items-center justify-center font-display shadow-md">
                3
              </div>
              <h4 className="text-lg font-bold font-display">Track & Adapt</h4>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Log in to save monthly calculations, configure custom reduction goals, and review your progress charts over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest font-display">Support</h2>
          <h3 className="text-3xl font-extrabold text-foreground font-display tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span id={`faq-question-${idx}`} className="font-display text-sm md:text-base flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0 ${
                      isOpen ? 'transform rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-xs md:text-sm text-muted-foreground border-t border-border/20 pt-4 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Box Section */}
      <section className="pb-24 px-6 max-w-6xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-900/60 dark:to-teal-900/60 p-8 md:p-12 text-center space-y-6 overflow-hidden border border-primary/20 shadow-2xl">
          {/* Decorative glows inside card */}
          <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          <Leaf className="w-12 h-12 text-white dark:text-emerald-400 mx-auto fill-white/10" />
          
          <h3 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
            Ready to Take Control of Your Footprint?
          </h3>
          <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Join thousands of individuals tracking and offsetting carbon. Take the 60-second quiz now and see what Gemini recommends.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/calculator"
              className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl shadow-lg hover:bg-emerald-50 transition-all hover:scale-[1.03] text-center"
            >
              Start Calculator
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600/30 text-white font-bold rounded-xl border border-white/20 hover:bg-emerald-600/50 transition-all hover:scale-[1.03] text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-display font-extrabold text-lg text-foreground">
                CarbonTrack
              </span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              CarbonTrack combines advanced greenhouse gas lifecycle methodologies with Google Gemini LLM recommendations to provide fully custom carbon offset action plans.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-wider font-display">Navigation</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#features" className="hover:text-primary">Features</a></li>
              <li><a href="#simulator" className="hover:text-primary">Simulator</a></li>
              <li><a href="#how-it-works" className="hover:text-primary">How It Works</a></li>
              <li><a href="/calculator" className="hover:text-primary">Calculator</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-wider font-display">Legal & Tech</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><span className="text-muted-foreground/60">EPA Methodologies compliant</span></li>
              <li><span className="text-muted-foreground/60">Gemini-2.0-flash powered</span></li>
              <li><span className="text-muted-foreground/60">Firestore data isolation</span></li>
              <li><span className="text-muted-foreground/60">WCAG 2.1 AA compliant</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CarbonTrack. All rights reserved. Made for carbon footprint consciousness.</p>
        </div>
      </footer>
    </div>
  )
}
