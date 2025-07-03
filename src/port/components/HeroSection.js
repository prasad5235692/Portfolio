import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import "./HeroSection.css";

const HeroSection = () => {
  const location = useLocation();
  const splineRef = useRef(null);
  const [loadSpline, setLoadSpline] = useState(false);

  // Smooth scroll to section (if linked)
  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Lazy load only on desktop and when visible
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;

    if (!isDesktop) return; // Skip for mobile

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Load Spline after slight delay
          setTimeout(() => setLoadSpline(true), 300); 
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (splineRef.current) {
      observer.observe(splineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-section scroll-smooth" id="Hero-section">
      {/* Overlay Content */}
      <div className="hero-overlay">
        <div
          data-aos="fade-right"
          data-aos-offset="300"
          data-aos-duration="1000"
          data-aos-easing="ease-in-sine"
        >
          <h1>
            <span style={{ color: "#d28203" }}>PRASAD K</span> FOR WEBSITE AND WEB DEVELOPMENT
          </h1>
          <p>
            I’m Prasad K, a passionate Full Stack Developer crafting seamless digital experiences. From intuitive front-end interfaces to robust back-end architecture.
          </p>
          <div className="tag-box1">
            <Link to="/About">
              <button className="nav-button">SEE MORE ABOUT US</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Spline Area */}
      <div
        ref={splineRef}
        className="spline-container transform-gpu will-change-transform"
      >
        {/* Optional light effect */}
        <div
          className="absolute bottom-[10%] w-[300px] h-[300px]
            bg-[radial-gradient(circle,rgba(255,150,22,0.96),transparent_70%)]
            blur-[80px] z-0 pointer-events-none"
        />

        {/* Lazy-loaded Spline */}
        {loadSpline && (
          <Spline
            scene="https://prod.spline.design/Z2AEf5-3ohW3XiFM/scene.splinecode"
          />
        )}
      </div>
    </div>
  );
};

export default HeroSection;
