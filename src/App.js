
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./port/components/Header";
import HeroSection from "./port/components/HeroSection";
import Services from "./port/components/Services";
import About from "./port/components/About";
import Education from "./port/components1/Education";
import Skills from "./port/components1/Skills";
import Contact from "./port/components1/Contact";
import Project from "./port/components1/Project";

import "./App.css";

function App() {
  const location = useLocation();

  // Scroll to section based on navigation state
  useEffect(() => {
    const scrollTarget = location?.state?.scrollTo;
    if (scrollTarget) {
      const section = document.getElementById(scrollTarget);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="app">
    
      <Header />

      <Routes>
        {/* Home page with scroll sections */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <Services />
              <Education />
              <Skills />
              <Project />
              <Contact />
            </>
          }
        />

        <Route
          path="/Home"
          element={
            <>
              <HeroSection />
              <Services />
              <Education />
              <Skills />
              <Project />
              <Contact />
            </>
          }
        />

        {/* Separate about page */}
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;