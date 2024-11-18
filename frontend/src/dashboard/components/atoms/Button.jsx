import React from 'react';
import './Button.css';

const Button = ({ onClick, label, className, ...props }) => (
  <button
    className={`button ${className}`} // Permite agregar clases adicionales
    onClick={onClick}
    {...props} // Para pasar otras props como `disabled`, `type`, etc.
  >
    {label}
  </button>
);

export default Button;
