import React from "react";
import img1 from "../../assets/Education.jpg";
import img2 from "../../assets/Education1.jpg";
import img3 from "../../assets/Education2.jpg";
import "./Education.css";

const educationData = [
  {
    title: "School",
    image: img1,
    details: [
      { icon: "🏫", label: "T.E.L.C Higher Secondary School" },
      { icon: "📍", label: "Pudukkottai, Tamil Nadu" },
      { icon: "🎓", label: "Year: 2017" },
    ],
  },
  {
    title: "College",
    image: img2,
    details: [
      { icon: "🏛️", label: "Alagappa University" },
      { icon: "🎓", label: "B.Sc (Computer Science)" },
      { icon: "📅", label: "2021 – 2024" },
    ],
  },
  {
    title: "Training",
    image: img3,
    details: [
      { icon: "💻", label: "Full Stack Development" },
      { icon: "🛠️", label: "Tech: MERN STACK" },
      { icon: "📅", label: "6 Months + 6 Months Internship" },
    ],
  },
];

const Education = () => {
  return (
    <section className="education-section">
      <h2><span className="highlight">EDU</span>CATION</h2>
      <p className="modern-skills-title1">
        I have a strong academic background in <strong>Computer Science</strong>, having completed my <strong>B.Sc</strong> from Alagappa University. I'm passionate about using my full-stack development knowledge to solve real-world problems.
      </p>
      <div className="card-container">
        {educationData.map((item, index) => (
          <div className="edu-card" key={index}>
            <img src={item.image} alt={item.title} className="edu-image" />
            <div className="edu-content">
              <h3>{item.title}</h3>
              <ul>
                {item.details.map((detail, i) => (
                  <li key={i}><span>{detail.icon}</span> {detail.label}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
