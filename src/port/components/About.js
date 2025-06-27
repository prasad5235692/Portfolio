import React from "react";
import { useEffect } from "react";


import "./About.css";
import profileImage from "../../assets/download23.jpg"; // Replace with your actual image path

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="about-section" id="about">
      <h2><span className="highlight">About</span> Me</h2>
      <div className="about-container">
        {/* Profile Image */}
        <div className="about-img">
          <img src={profileImage} alt="Prasad" />
        </div>

        {/* About Text */}
        <div className="about-text">
          <p>
            I'm <strong>Prasad</strong>, a passionate <strong>MERN Stack Developer</strong> with a Bachelor's degree in Computer Science from Alagappa University. I've undergone hands-on training in Full Stack Web Development and built multiple mini-projects using React, Node.js, and MongoDB.
          </p>
          <p>
            I specialize in building full-stack web applications using the <strong>MERN</strong> stack. My focus is on writing clean, efficient code and creating user-centric designs. I'm enthusiastic about collaborating on real-world projects and continuously expanding my technical skill set.
          </p>

          <ul className="about-info">
            <li><strong>🎓 Degree:</strong> B.Sc Computer Science</li>
            <li><strong>🌐 Specialization:</strong> Full Stack Web Development (MERN)</li>
            <li><strong>📍 Location:</strong> Pudukkottai, Tamil Nadu, India</li>
            <li><strong>📧 Email:</strong> yourmail@example.com</li>
          </ul>

          <button href="/resume.pdf" download className="download-btn">📄 Download Resume</button>
        </div>
      </div>
    </section>
  );
};

export default About;
