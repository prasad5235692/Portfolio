import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPaintBrush,
  FaServer,
  FaCubes,
  FaDatabase,
  FaTools,
  FaRocket
} from "react-icons/fa";
import "./Skills.css";

const skillsData = [
  { icon: <FaPaintBrush />, title: "Frontend", tools: "HTML, CSS, JS, React" },
  { icon: <FaCubes />, title: "Frameworks", tools: "Tailwind, Bootstrap, Spline" },
  { icon: <FaServer />, title: "Backend", tools: "Node.js, Java, Express.js" },
  { icon: <FaDatabase />, title: "Database", tools: "MongoDB, MySQL" },
  { icon: <FaTools />, title: "Tools", tools: "GitHub, VS Code, Eclipse" },
  { icon: <FaRocket />, title: "Fullstack", tools: "MERN Stack" },
];

const Skills = () => {
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
    <section
      id="skills-section"
      className="modern-skills-section"
      style={{ marginTop: "80px" }} // 👈 Add this inline to offset the fixed header
    >
      <h2 ><span style={{ color: '#d28203' }}>TECH </span>STACK</h2>
      <p className="modern-skills-title1">Strong in JavaScript, React.js, Node.js, Express.js, and MongoDB. Experienced in building RESTful APIs, responsive frontends, and scalable backend systems. Familiar with Git, Postman, and modern UI frameworks like Tailwind CSS.</p>
      <div className="modern-skills-grid">
        {skillsData.map((item, idx) => (
          <div key={idx} className="modern-skill-card">
            <span className="modern-skill-icon">{item.icon}</span>
            <div className="modern-skill-text">
              <h3>{item.title}</h3>
              <p>{item.tools}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
