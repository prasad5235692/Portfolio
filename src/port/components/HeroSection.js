
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import "./HeroSection.css";


const HeroSection = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);


  return (
    
    <div className="hero-section">
  <div className="Spline">
      {/* Fullscreen Spline */}
      
      <Spline
            scene="https://prod.spline.design/IEz-yu7jpuzEOzJu/scene.splinecode"
        className="spline-canvas"   frameBorder="0"
      />
</div>

      {/* Text content overlay */}
      <div className="hero-overlay">
        <h1><span2 >PRASAD K</span2></h1>
        <h3>FOR WEBSITE AND WEB DEVELOPMENT</h3>
        <h1 className="h2">FULLSTACK'S PORTFOLIO</h1>
        <div className="tag-box1">
          <Link to="/About">
        <button className="nav-button">SEE MORE ABOUT US</button>
        </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;




