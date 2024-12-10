import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <FontAwesomeIcon icon={faPaw} className="footer-icon" />
        <p>Copyright© {new Date().getFullYear()} Disha Kolapate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 