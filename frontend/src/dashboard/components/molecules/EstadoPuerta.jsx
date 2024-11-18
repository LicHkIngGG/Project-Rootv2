import React from 'react';
import EstadoEtiqueta from '../atoms/EstadoEtiqueta';

const EstadoPuerta = ({ nombre, estado }) => (
  <div className="estado-puerta">
    <span>{nombre}</span>
    <EstadoEtiqueta estado={estado} />
  </div>
);

export default EstadoPuerta;
