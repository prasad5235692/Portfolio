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
         
         
            <Spline  data-aos="fade-zoom-in"
     data-aos-easing="ease-in-back"
     data-aos-delay="1000"
     data-aos-offset="0"
     data-aos-duration="3500"
            scene="https://prod.spline.design/1nwtrf4vAOpxXoeA/scene.splinecode"
      />
        </div>
      </div>
     
  );
};

export default HeroSection;
