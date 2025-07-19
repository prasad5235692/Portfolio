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
      <h2><span style={{ color: '#d28203' }}>About</span> Me</h2>
      <div className="about-container">
        {/* Profile Image */}
        <div data-aos="fade-right"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine"
     data-aos-duration="1000" className="about-img">
          <img src={profileImage} alt="Prasad" />
        </div>

        {/* About Text */}
        <div data-aos="fade-left"
     data-aos-anchor="#example-anchor"
     data-aos-offset="500"
     data-aos-duration="2500"className="about-text">
          <p>
            I'm <strong>Prasad</strong>, a passionate <strong>MERN & MARN  Stack Developer</strong> with a Bachelor's degree in Computer Science from Alagappa University. I've undergone hands-on training in Full Stack Web Development and built multiple mini-projects using React, Node.js, and MongoDB.
          </p>
          <p>
            I specialize in building full-stack web applications using the <strong>MERN</strong> stack. My focus is on writing clean, efficient code and creating user-centric designs. I'm enthusiastic about collaborating on real-world projects and continuously expanding my technical skill set.
          </p>

          <ul className="about-info">
            <li className="li"><strong>🎓 Degree:</strong> B.Sc Computer Science</li>
            <li className="li"><strong>🌐 Specialization:</strong> Full Stack Web Development (MERN & MARN)</li>
            <li className="li"><strong>📍 Location:</strong> Pudukkottai, Tamil Nadu, India</li>
            <li className="li"><strong>📧 Email:</strong> prasad.itwed@gmail.com</li>
          </ul>

<button
  className="nav-button"
  onClick={() => {
    const link = document.createElement("a");
    link.href = "/Prasad K - Resume.pdf";
    link.setAttribute("download", "Prasad K - Resume.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
>
  📄 Download Resume
</button>
<button
  className="nav1-button"
  onClick={() => {
    window.open("/Prasad K - Resume.pdf", "_blank");
  }}
>
  📄 View Resume
</button>




        </div>
      </div>
    </section>
  );
};

export default About;
