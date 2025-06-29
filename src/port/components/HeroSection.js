
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

   {/* Right Section - Spline */}
  <div className="hero-right">
    <div className="spline-container mx-auto flex items-center justify-center relative">
      {/* Light glow background */}
      <div className="absolute top-1/2 left-1/2 w-full h-full 
                      transform -translate-x-1/2 -translate-y-1/2 
                      bg-[radial-gradient(circle,rgba(255,200,100,0.4),rgba(255,140,0,0.1)_60%,transparent_90%)]
                      blur-[100px] z-0 pointer-events-none">
      </div>

      {/* Spline 3D */}
      <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] relative z-10">
    {/* Spline viewer */}
    <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] relative z-10">
  </div>
<div className="spline-glow-wrapper relative flex justify-center items-center">
  {/* GOLD GLOW IN TOP-RIGHT CORNER */}
  <div className="gold-glow absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 z-10"></div>


  {/* Spline 3D object */}
  <Spline  className="spline-wrapper"

         scene="https://prod.spline.design/puluItHHylFUwFaM/scene.splinecode"

      />
</div></div>
</div>
</div>



      {/* Text content overlay */}
      <div className="hero-overlay">
      <h1>  <span style={{ color: '#d28203' }}>PRASAD K</span> FOR WEBSITE AND WEB DEVELOPMENT</h1>

      <p>I’m Prasad K, a passionate Full Stack Developer crafting seamless digital experiences. From intuitive front-end interfaces to robust back-end architecture.</p>
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




