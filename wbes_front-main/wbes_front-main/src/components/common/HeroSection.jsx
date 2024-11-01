// src/components/HeroSection.jsx

import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-content">
        <h1>Master Your Exams with WBES</h1>
        <p>Comprehensive online preparation and secure examinations at your fingertips.</p>
        <a href="/signup" className="cta-button">Get Started</a>
      </div>
      <div className="hero-image">
        <img 
          src="https://raw.githubusercontent.com/undraw/undraw/master/public/illustrations/undraw_online_courses_re_rw3v.svg" 
          alt="Students studying" 
        />
      </div>
    </section>
  );
};

export default HeroSection;
