import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import "./HeroSection.css";

const HeroSection = () => {
  const location = useLocation();
  const splineRef = useRef();
  const [showSpline, setShowSpline] = useState(false);

  // Scroll to section if needed
  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Lazy load Spline using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowSpline(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px",
        threshold: 0.2,
      }
    );

    if (splineRef.current) {
      observer.observe(splineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-section scroll-smooth" id="Hero-section">
      {/* Header Content */}
      <div className="hero-overlay">
        <div
          data-aos="fade-right"
          data-aos-offset="300"
          data-aos-duration="1500"
          data-aos-easing="ease-in-sine"
        >
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

      {/* Spline container */}
      <div
        ref={splineRef}
        className="spline-container will-change-transform transform-gpu"
      >
        {/* Optional glowing background effect */}
        <div
          className="absolute bottom-[10%] w-[300px] h-[300px] 
            bg-[radial-gradient(circle,rgba(255,150,22,0.96),transparent_70%)]
            blur-[80px] z-0 pointer-events-none"
        />
        {showSpline && (
          <Spline
            data-aos="fade-zoom-in"
            data-aos-easing="ease-in-back"
            data-aos-delay="500"
            data-aos-offset="0"
            scene="https://prod.spline.design/Z2AEf5-3ohW3XiFM/scene.splinecode"
          />
        )}
      </div>
    </div>
  );
};

export default HeroSection;
