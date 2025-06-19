// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black py-3 mt-5">
      <div className="container text-center">
        <small className="text-secondary d-block mb-2">
          © {new Date().getFullYear()} MoodTunes By Dfaalt. Dibuat dengan 🤍 dan
          ekspresi wajahmu.
        </small>
        <div className="d-flex justify-content-center gap-3">
          <a
            href="https://www.tiktok.com/@dfaalt"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Instagram"
          >
            <i className="bi bi-tiktok fs-5"></i>
          </a>
          <a
            href="https://instagram.com/dfaalt"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Instagram"
          >
            <i className="bi bi-instagram fs-5"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/ilham-maulana1101/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="LinkedIn"
          >
            <i className="bi bi-linkedin fs-5"></i>
          </a>
          <a
            href="https://github.com/Dfaalt"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="GitHub"
          >
            <i className="bi bi-github fs-5"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
