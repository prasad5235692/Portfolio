import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
const Project = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

return( 
    <div className="Project-Section">
        <h2>Dresaa-Shoping</h2>
    </div>
);
};
export default Project;