import React from "react";
import {Routes,Route } from "react-router-dom";
import Header from "./port/components/Header";
import HeroSection from "./port/components/HeroSection";
import Services from "./port/components/Services";

import Education from "./port/components1/Education";
import Skills from "./port/components1/Skills";
import ContactInfoSection from "./port/components1/ContactInfoSection";
import Project from "./port/components1/Project";

import "./App.css";
function App() {
  return ( 
    <div className="app">
      <Header />
      <HeroSection />
      <Services/>
        <Routes>
          
      <Route path="/Education" element={<Education/>}/>
      <Route path="/Skills" element={<Skills/>}/>
      <Route path="/Project" element={<Project/>}/>
      <Route path="/ContactInfoSection" element={<ContactInfoSection/>}/>
      </Routes>  
    </div>

  );
}


export default App;
