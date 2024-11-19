import React from 'react';
import './Button.css';

const Button = ({ onClick, label, className, ...props }) => (
  <button
    className={`button ${className}`} 
    onClick={onClick}
    {...props} 
  >
    {label}
  </button>
);

export default Button;
