import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Project.css";

import img1 from "../../assets/meethub 1.png";
import img2 from "../../assets/meethub 2.png";
import img3 from "../../assets/meethub 3.png";

const images = [img1, img2, img3];

const Project = () => {
  const location = useLocation();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }

    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [location]);

  return (
    <section className="project-section" id="project-section">
    
      <div className="project-container">
        {/* Left Image Slider */}
        <div className="project-image">
          <div className="slider-wrapper">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  className="slider-image"
                  alt={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Text and Button */}
        <div className="project-content">
          <h2>
            <span style={{ color: "#d28203" }}>MEET</span> HUB!
          </h2><br></br>
          <p >
         MEET HUB is a real-time chat application with a clean and modern interface.
It features user authentication, instant messaging, and responsive design.
Built using React, Firebase, and Vite for fast performance.
          </p>
          <a
            href="https://meethub-five.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            <button className="but">View Project</button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Project;
