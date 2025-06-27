// Inside Home.js
import React, { useEffect } from "react";
import {Routes,Route } from "react-router-dom";
import Header from "./port/components/Header";
import Services from "./port/components/Services";
import HeroSection from "./port/components/HeroSection";
import { useLocation } from "react-router-dom";
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
      <Routes>
        <Route path="/Header" element={<Header/>}/>
        <Route path="/HeroSection" element={<HeroSection/>}/>
        <Route path="/Services" element={<Services/>}/>
      </Routes>
    </div>
  );
};

export default Home;
