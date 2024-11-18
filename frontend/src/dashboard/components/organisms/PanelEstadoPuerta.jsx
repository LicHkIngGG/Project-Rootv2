import React, { useState } from 'react';
import './PanelEstadoPuerta.css';

const PanelEstadoPuerta = () => {
  const [estadoChapa, setEstadoChapa] = useState('CERRADO'); // Estado de la chapa
  const [botonEstado, setBotonEstado] = useState('CHAPA APAGADA'); // Texto dinámico del botón
  const [botonClase, setBotonClase] = useState('boton-apagado'); // Clase CSS dinámica del botón

  const handleButtonClick = async () => {
    try {
      // Cambiar estado inicial al presionar
      setBotonEstado('ENCENDIENDO CHAPA...');
      setBotonClase('boton-encendido');
      setEstadoChapa('ABIERTO');

      // Llamada al backend
      const response = await fetch('http://127.0.0.1:5000/api/activar_chapa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accion: 'abrir' }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        // Si la operación fue exitosa
        setTimeout(() => {
          setEstadoChapa('CERRADO');
          setBotonEstado('CHAPA APAGADA');
          setBotonClase('boton-apagado');
        }, 2000);
      } else {
        // En caso de error del backend
        alert('Error al abrir la chapa: ' + data.message);
        setEstadoChapa('CERRADO');
        setBotonEstado('CHAPA APAGADA');
        setBotonClase('boton-apagado');
      }
    } catch (error) {
      // En caso de fallo en la comunicación con el backend
      console.error('Error al conectar con el servidor:', error);
      alert('Error al conectar con el servidor');
      setEstadoChapa('CERRADO');
      setBotonEstado('CHAPA APAGADA');
      setBotonClase('boton-apagado');
    }
  };

  return (
    <div className="panel-estado-puerta">
      <h2>ESTADOS DE LA PUERTA</h2>
      <p>Estado de la chapa: <strong>{estadoChapa}</strong></p>
      <button className={botonClase} onClick={handleButtonClick}>
        {botonEstado}
      </button>
    </div>
  );
};

export default PanelEstadoPuerta;
