import React from 'react';
import './EstadoEtiqueta.css';

const EstadoEtiqueta = ({ estado }) => (
  <div className={`estado-etiqueta ${estado.toLowerCase()}`}>
    {estado.toUpperCase()}
  </div>
);

export default EstadoEtiqueta;
