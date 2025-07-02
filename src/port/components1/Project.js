import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Project.css"; // optional CSS file

const Project = () => {
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
    <section className="project-section" id="project-section">
      <h2><span className="highlight">Dresaa</span>-Shopping</h2>
      <p className="project-description">
        An e-commerce web application where users can browse and purchase clothes. Built using the MERN stack.
      </p>
      {/* Add more project cards here if needed */}
    </section>
  );
};

export default Project;
