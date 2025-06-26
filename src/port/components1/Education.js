import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import img1 from "../../assets/Education.jpg";
import img2 from "../../assets/Education1.jpg";
import img3 from "../../assets/Education2.jpg";
import "./Education.css";

const Education = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const [showSchoolDetail, setShowSchoolDetail] = useState(false);
  const [showCollegeDetail, setShowCollegeDetail] = useState(false);
  const [showTrainingDetail, setShowTrainingDetail] = useState(false);

  const schoolRef = useRef(null);
  const collegeRef = useRef(null);
  const trainingRef = useRef(null);

  // Scroll to detail if it becomes visible
  useEffect(() => {
    if (showSchoolDetail && schoolRef.current) {
      schoolRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showSchoolDetail]);

  useEffect(() => {
    if (showCollegeDetail && collegeRef.current) {
      collegeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showCollegeDetail]);

  useEffect(() => {
    if (showTrainingDetail && trainingRef.current) {
      trainingRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showTrainingDetail]);

  return (
    <section className="services1" id="education-section">
      <h2><span className="Education">EDU</span>CATION</h2>
      <p>
        I have a strong academic background in <strong>Computer Science</strong>, having completed my <strong>B.Sc (Computer Science)</strong> from Alagappa University. During my studies, I gained hands-on experience in coding, problem-solving, and web development. I'm passionate about using my full-stack development knowledge to solve real-world problems.
      </p>

      <div className="service1-list">
        {/* === SCHOOL CARD === */}
        <div className="service1-box">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={img1} alt="School" />
              <h3 className="edu-label">SCHOOL</h3>
            </div>
            <div className="flip-card-back" onClick={() => setShowSchoolDetail(!showSchoolDetail)}>
              <p>Click here to view school details</p>
            </div>
          </div>
          {showSchoolDetail && (
            <div className="edu-detail-box" ref={schoolRef}>
              <p>🏫 <strong>School:</strong> T.E.L.C Higher Secondary School</p>
              <p>📍 <strong>Location:</strong>Pudukkottai Tamil Nadu</p>
              <p>🎓 <strong>Year:</strong> 2017</p>
            </div>
          )}
        </div>

        {/* === COLLEGE CARD === */}
        <div className="service1-box">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={img2} alt="College" />
              <h3 className="edu-label">COLLEGE</h3>
            </div>
            <div className="flip-card-back" onClick={() => setShowCollegeDetail(!showCollegeDetail)}>
              <p>Click here to view college details</p>
            </div>
          </div>
          {showCollegeDetail && (
            <div className="edu-detail-box" ref={collegeRef}>
              <p>🏛️ <strong>College:</strong> Alagappa University</p>
              <p>🎓 <strong>Degree:</strong> B.Sc (Computer Science)</p>
              <p>📅 <strong>Year:</strong> 2021-to-2024</p>
            </div>
          )}
        </div>

        {/* === TRAINING CARD === */}
        <div className="service1-box">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={img3} alt="Training" />
              <h3 className="edu-label">TRAINING</h3>
            </div>
            <div className="flip-card-back" onClick={() => setShowTrainingDetail(!showTrainingDetail)}>
              <p>Click here to view training details</p>
            </div>
          </div>
          {showTrainingDetail && (
            <div className="edu-detail-box" ref={trainingRef}>
              <p>💻 <strong>Course:</strong> Full Stack Development and Internship</p>
              <p>🛠️ <strong>Tech:</strong> MERN STACK</p>
              <p>📅 <strong>Duration:</strong> 6 Months training, 6 Months Internship</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Education;
