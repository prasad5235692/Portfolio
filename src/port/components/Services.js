import React from "react";
import { IoLogoHtml5 } from "react-icons/io";
import { DiJavascript } from "react-icons/di";
import { FaReact } from "react-icons/fa6";
import { FaBootstrap } from "react-icons/fa6";
import { IoLogoNodejs } from "react-icons/io5";
import { FaJava } from "react-icons/fa6";
import { TbBrandMongodb } from "react-icons/tb";
import { GrMysql } from "react-icons/gr";
import { FaGithub } from "react-icons/fa";
import "./Services.css";

function Services() {
  return (
    <section className="services">
      <h2><span1 className="color">WHAT </span1>WE DO?</h2>
      <p>Yes, I can help you with Full Stack Development both frontend and backend including.
        If you tell me what you're working on or want to build I can guide you step by step including project structure, coding, deployment, and more. Would you like to start with a project or learn topic by topic?</p>
      <div className="service-list">
        <div className="service-box"> Frontend (Client-Side)<ul> <li><IoLogoHtml5 /> HTML, CSS,<li><DiJavascript /> JavaScript</li></li><li><FaReact /> React.js</li><li><FaBootstrap /> Bootstrap</li> </ul> </div>
        <div className="service-box"> Backend (Server-Side)<ul> <li><IoLogoNodejs /> Node.js </li><li><FaJava /> JAVA</li> </ul></div>
        <div className="service-box"> Database<ul><li><TbBrandMongodb /> MongoDB With Mongoose</li><li><GrMysql /> MySQL</li></ul></div>
        <div className="service-box">DevOPS/Tools<ul><li><FaGithub /> Git & GitHUB</li></ul>

        </div>
      </div>
       
      <button className="but" > CHECK OUT</button>
    
    </section>
  );
}

export default Services;
