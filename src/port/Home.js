// Inside Home.js
import React, { useEffect } from "react";
import Header from "./components/Header";
import Services from "./components/Services";
import { useLocation } from "react-router-dom";
import HeroSection from "./components/HeroSection";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const target = document.getElementById(location.state.scrollTo);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="home">
      <Header />
      <Services/>
       <HeroSection />
    
    </div>
  );
};

export default Home;
