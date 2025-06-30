import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./port/components/Header";
import HeroSection from "./port/components/HeroSection";
import Services from "./port/components/Services";
import About from "./port/components/About";
import Education from "./port/components1/Education";
import Skills from "./port/components1/Skills";
import Contact from "./port/components1/Contact";
import Project from "./port/components1/Project";
import AOS from "aos";
import "aos/dist/aos.css";

import "./App.css";

function App() {
  const location = useLocation();
  const [showSections, setShowSections] = useState(false);

  useEffect(() => {
    const scrollTarget = location?.state?.scrollTo;
    if (scrollTarget) {
      const section = document.getElementById(scrollTarget);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }

    const timer = setTimeout(() => {
      setShowSections(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
    });
  }, []);

  return (
    <div className="app">
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              {showSections && (
                <>
                  <Services />
                  <Education />
                  <Skills />
                  <Project />
                  <Contact />
                </>
              )}
            </>
          }
        />

        <Route
          path="/Home"
          element={
            <>
              <HeroSection />
              {showSections && (
                <>
                  <Education />
                  <Skills />
                  <Project />
                  <Contact />
                </>
              )}
            </>
          }
        />

        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
