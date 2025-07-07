import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Project.css";

import img1 from "../../assets/meethub 1.png";
import img2 from "../../assets/meethub 2.png";
import img3 from "../../assets/meethub 3.png";

import grab1 from "../../assets/gra1.png";
import grab2 from "../../assets/gra2.png";
import grab3 from "../../assets/gra3.png";

import admin1 from "../../assets/ad1.png";
import admin2 from "../../assets/ad2.png";
import admin3 from "../../assets/ad3.png";

const images = [img1, img2, img3];
const grabziImages = [grab1, grab2, grab3];
const grabziAdminImages = [admin1, admin2, admin3];

const Project = () => {
  const location = useLocation();
  const [currentImage, setCurrentImage] = useState(0);
  const [grabziImageIndex, setGrabziImageIndex] = useState(0);
  const [grabziAdminImageIndex, setGrabziAdminImageIndex] = useState(0); // ✅ new state

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }

    const meetInterval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    const grabziInterval = setInterval(() => {
      setGrabziImageIndex((prevIndex) => (prevIndex + 1) % grabziImages.length);
    }, 3000);

    const grabziAdminInterval = setInterval(() => {
      setGrabziAdminImageIndex((prevIndex) => (prevIndex + 1) % grabziAdminImages.length);
    }, 3000);

    return () => {
      clearInterval(meetInterval);
      clearInterval(grabziInterval);
      clearInterval(grabziAdminInterval);
    };
  }, [location]);

  return (
    <section className="project-section" id="project-section">
      <h2 className="h2">Project</h2>

      {/* Project 1: MeetHub */}
      <div className="project-container">
        <div className="project-image">
          <div className="slider-wrapper">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              {images.map((src, index) => (
                <img key={index} src={src} className="slider-image" alt={`MeetHub Slide ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="project-content">
          <h2><span style={{ color: "#d28203" }}>MEET</span> HUB!</h2>
          <br />
          <p>
            MEET HUB is a real-time video chat application built with MERN stack.
            It features WebRTC integration, user rooms, and responsive UI.
          </p>
          <a href="https://meethub-five.vercel.app/" target="_blank" rel="noreferrer">
            <button className="but">View Project</button>
          </a>
        </div>
      </div>

      {/* Project 2: Grabzi */}
      <div className="project-container">
        <div className="project-content">
          <h2><span style={{ color: "#d28203" }}>GRABZI</span> SHOPPING SITE</h2>
          <br />
          <p>
            Grabzi is an eCommerce platform where users can browse, filter, and purchase products.
            Developed with React, Redux, and Firebase, it offers a smooth shopping experience with cart and checkout features.
          </p>
          <a href="https://grabzi.vercel.app" target="_blank" rel="noreferrer">
            <button className="but">View Project</button>
          </a>
        </div>

        <div className="project-image">
          <div className="slider-wrapper">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${grabziImageIndex * 100}%)` }}
            >
              {grabziImages.map((src, index) => (
                <img key={index} src={src} className="slider-image" alt={`Grabzi Slide ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project 3: Grabzi Admin Panel */}
      <div className="project-container">
        <div className="project-image">
          <div className="slider-wrapper">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${grabziAdminImageIndex * 100}%)` }}
            >
              {grabziAdminImages.map((src, index) => (
                <img key={index} src={src} className="slider-image" alt={`Grabzi Admin Slide ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="project-content">
          <h2><span style={{ color: "#d28203" }}>GRABZI</span> ADMIN PANEL</h2>
          <br />
          <p>
            The admin dashboard for Grabzi allows product management, order tracking, and analytics.
            Built using React, Node.js, and Firebase with a responsive interface.
          </p>
          <a href="https://grabzi-admin.vercel.app" target="_blank" rel="noreferrer">
            <button className="but">View Project</button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Project;
