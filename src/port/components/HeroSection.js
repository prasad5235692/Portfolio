import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";

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

    const timer = setTimeout(() => {
      setShowSpline(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 relative overflow-hidden">
       {/* Right: Spline Model */}
      <div className="w-full md:w-1/2 mt-10 md:mt-0 relative flex justify-center items-center">
        {/* Glowing light behind model */}
        <div className="absolute bottom-[10%] w-[300px] h-[300px] 
            bg-[radial-gradient(circle,rgba(255,150,22,0.96),transparent_70%)] 
            blur-[100px] z-0 pointer-events-none" />
        
        {showSpline && (
          <div className="w-[400px] h-[400px] relative z-10">
            <Spline scene="https://prod.spline.design/2yYWkO43feqMDq1L/scene.splinecode" />
          </div>
        )}
      </div>
    
      {/* Left: Text Content */}
      <div className="w-full md:w-1/2 z-10 text-left">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          <span className="text-orange-500">PRASAD K</span> FOR WEBSITE AND <br />
          WEB DEVELOPER
        </h1>
        <p className="text-lg mb-8">
          I’m Prasad K, a passionate Full Stack Developer crafting seamless
          digital experiences. From intuitive front-end interfaces to robust
          back-end architecture.
        </p>
        <Link to="/About">
          <button className="bg-gradient-to-r from-yellow-500 to-orange-700 px-6 py-3 rounded-lg text-black font-semibold shadow-md hover:scale-105 transition">
            SEE MORE ABOUT US
          </button>
        </Link>
      </div>

     </div>
  );
};

export default HeroSection;
