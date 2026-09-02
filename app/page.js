'use client';
import { useState, useCallback } from 'react';
import MoonJourney from './components/MoonJourney';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Clients from './components/Clients';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Connect from './components/Connect';
import Footer from './components/Footer';
import History from './components/History';

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const handlePreloaderDone = useCallback(() => setPreloaderDone(true), []);

  return (
    <>
      <Preloader onComplete={handlePreloaderDone} />
      <Navigation visible={preloaderDone} />

      {/* Moon — fixed full-viewport canvas; scroll-driven via GSAP ScrollTrigger */}
      <MoonJourney />

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero — aquadev stacked typographic */}
        <Hero />

        {/* About — text layer with cursor reveal (preserved) */}
        <About />

         {/* Services — bordered row list */}
        <Skills />

        {/* Selected Works — project list */}
        <Clients />

        {/* Experience timeline */}
        <Experience />

        
        <History />

        {/* Contact — SAY HI */}
        <Connect />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
