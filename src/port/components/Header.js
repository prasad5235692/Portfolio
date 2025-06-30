import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faLaptop,
  faHouse,
  faIdCardClip
} from '@fortawesome/free-solid-svg-icons';
import icon3 from "../../assets/icon3.png";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo"><span1>I</span1>T</div>
      <nav>
        <div  className="nav-links">

          <div   data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="1000" 
     className="icon-tooltip" 
            onClick={() => navigate('/', { state: { scrollTo: 'Home-section' } })}
            style={{ cursor: 'pointer' }}
          >
            <span className="span"><FontAwesomeIcon icon={faHouse} /></span>
            <span className="tooltip-text">Home</span>
          </div>

          <div data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="1500"
            className="icon-tooltip"
            onClick={() => navigate("/", { state: { scrollTo: "Education-section" } })}
            style={{ cursor: 'pointer' }}
          >
            <span className="span"><FontAwesomeIcon icon={faUserGraduate} /></span>
            <span className="tooltip-text">Education</span>
          </div>

          <div data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="2000"
            className="icon-tooltip"
            onClick={() => navigate('/', { state: { scrollTo: 'skills-section' } })}
            style={{ cursor: 'pointer' }}
          >
            <span className="span">
              <img src={icon3} alt="icon3" className="nav-icon" />
            </span>
            <span className="tooltip-text">Skills</span>
          </div>

          <div data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="2500"
            className="icon-tooltip"
            onClick={() => navigate('/', { state: { scrollTo: 'project-section' } })}
            style={{ cursor: 'pointer' }}
          >
            <span className="span"><FontAwesomeIcon icon={faLaptop} /></span>
            <span className="tooltip-text">Projects</span>
          </div>

          <div data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="3000"
            className="icon-tooltip"
            onClick={() => navigate('/', { state: { scrollTo: 'contact-section' } })}
            style={{ cursor: 'pointer' }}
          >
            <span className="span"><FontAwesomeIcon icon={faIdCardClip} /></span>
            <span className="tooltip-text">Contact</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
