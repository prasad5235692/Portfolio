import React, { useState } from "react";
import "./ContactAss.css";

const ContactAss = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://backend-protfolio-gs5i.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({
          type: "success",
          message: data.message || "Message sent successfully!",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setFeedback({
        type: "error",
        message: "Server error. Please try again later.",
      });
    }
  };

  return (
    <div className="contact-container">
      <h2 className="contact-title">GET IN TOUCH</h2>
      <p className="contact-subtitle">
        I’d love to hear from you. Whether you have a question or just want to
        say hi.
      </p>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject (Optional)"
          value={formData.subject}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        {/* Display Feedback Message */}
        {feedback.message && (
          <div className={`form-feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        <button className="but1" type="submit">
          SEND MESSAGE
        </button>
      </form>
    </div>
  );
};

export default ContactAss;
