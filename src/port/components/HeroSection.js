import React, { useEffect, } from "react";
import { useLocation, Link } from "react-router-dom";
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
    <div className="hero-section" id="Hero-section" >
     

      {/* Header Content */}
      <div className="hero-overlay">
        <div data-aos="fade-right"
     data-aos-offset="300"
     data-aos-duration="1500"
     data-aos-easing="ease-in-sine">
        <h1>
          <span style={{ color: "#d28203" }}>PRASAD K</span> FOR WEBSITE AND WEB DEVELOPMENT
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
      <div className="spline-container">
          <div className="absolute bottom-[10%] w-[300px] h-[300px] 
                  bg-[radial-gradient(circle,rgba(255, 150, 22, 0.96),transparent_70%)]
                  blur-[80px] z-0 pointer-events-none" />
         
            <Spline data-aos="zoom-in"
            data-aos-duration="2500"
              scene="https://prod.spline.design/Z2AEf5-3ohW3XiFM/scene.splinecode"
            />
        
        </div>
      </div>
     
  );
};

export default HeroSection;
