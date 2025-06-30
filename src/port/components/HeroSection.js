import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import "./HeroSection.css";

const HeroSection = () => {
  const location = useLocation();
  const [showSpline, setShowSpline] = useState(false);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }

    // Delay spline render by 300ms to prioritize header
    const timer = setTimeout(() => {
      setShowSpline(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="hero-section">
      {/* Spline container */}
      <div className="spline-container mx-auto flex items-center justify-center relative">
        <div className="gold-glow absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 z-10">

        <div className="spline-wrapper relative z-20">
          <div className="absolute bottom-[10%] w-[300px] h-[300px] 
                  bg-[radial-gradient(circle,rgba(255, 150, 22, 0.96),transparent_70%)]
                  blur-[80px] z-0 pointer-events-none" />
<div className="w-full flex justify-center items-center py-10">
  <div className="w-full max-w-[320px] sm:max-w-[400px] min-h-[300px] relative z-10">
          {showSpline && (
            <Spline
              className="spline-wrapper"
              scene="https://prod.spline.design/puluItHHylFUwFaM/scene.splinecode"
            />
          )}
        </div>
      </div></div></div>
      </div>

      {/* Header Content */}
      <div className="hero-overlay">
        <h1>
          <span style={{ color: "#d28203" }}>PRASAD K</span> FOR WEBSITE AND
          WEB DEVELOPMENT
        </h1>
        <p>
          I’m Prasad K, a passionate Full Stack Developer crafting seamless
          digital experiences. From intuitive front-end interfaces to robust
          back-end architecture.
        </p>
        <div className="tag-box1">
          <Link to="/About">
            <button className="nav-button">SEE MORE ABOUT US</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
