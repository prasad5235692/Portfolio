import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import img from "../../assets/qr-code.png";
import "./Contact.css";

const ContactInfoSection = () => {
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
    <div className="modern-contact-container" id="contact-section">
      <div className="card-glass">
        <div className="avatar-glow">PK</div>
        <h2 className="name">Prasad K</h2>
        <p className="title">MERNStack Developer</p>

        <div className="contact-group">
          <div className="contact-item">
            <FontAwesomeIcon icon={faPhone} />
            <span>+91 9342936209</span>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>prasad.itweb@gmail.com</span>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>Tamil Nadu, India</span>
          </div>
        </div>

        <div className="social-links">
          <a href="https://github.com/prasad5235692" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="https://www.linkedin.com/in/prasad-k-7878b9335/" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://wa.me/919342936209" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>

        <div className="qr-block">
          <img src={img} alt="QR Code" />
          <p>Scan to connect on WhatsApp</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
