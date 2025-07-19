import { DiJavascript } from "react-icons/di";
import { FaAngular } from "react-icons/fa";
import { FaReact, FaBootstrap, FaJava, FaGithub } from "react-icons/fa6";
import { IoLogoNodejs } from "react-icons/io5";
import { TbBrandMongodb } from "react-icons/tb";
import { GrMysql } from "react-icons/gr";
import { VscVscodeInsiders } from "react-icons/vsc";
import { SiExpress, SiEclipseide } from "react-icons/si";
import "./Services.css";

function Services() {
  return (
    <section className="services">
      <h2><span>WHAT </span>WE DO?</h2>
      <p className="modern-skills-title1">
        Yes, I can help you with Full Stack Development both frontend and backend including.
        If you tell me what you're working on or want to build I can guide you step by step including
        project structure, coding, deployment, and more. Would you like to start with a project or learn topic by topic?
      </p>
      <div className="service-list">
        <div className="service-box">
          Frontend (Client-Side)
          <ul>
            <li><FaReact />React+vite</li>
            <li><FaAngular />Angular</li>
            <li> <DiJavascript />JavaScript </li>
            <li><FaBootstrap /> Bootstrap</li>
          </ul>
        </div>
        <div className="service-box">
          Backend (Server-Side)
          <ul>
            <li><IoLogoNodejs /> Node.js</li>
            <li><FaJava /> Java</li>
            <li><SiExpress /> Express.js</li>
          </ul>
        </div>
        <div className="service-box">
          Database
          <ul>
            <li><TbBrandMongodb /> MongoDB With Mongoose</li>
            <li><GrMysql /> MySQL</li>
            <li><FaJava /> Java</li>
          </ul>
        </div>
        <div className="service-box">
          DevOPS/Tools
          <ul>
            <li><FaGithub /> Git & GitHUB</li>
            <li><VscVscodeInsiders /> VS Code</li>
            <li><SiEclipseide /> Eclipse</li>
          </ul>
        </div>
      </div>

      <button className="but">CHECK OUT</button>
    </section>
  );
}

export default Services;
