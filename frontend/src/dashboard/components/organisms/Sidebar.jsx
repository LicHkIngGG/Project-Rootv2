import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation(); // Obtiene la ruta actual
  const [selected, setSelected] = useState(location.pathname); // Ruta seleccionada inicialmente

  const handleSelect = (path) => {
    setSelected(path); // Actualiza el estado al seleccionar una opción
  };

  return (
    <div className="sidebar">
      <h2>ADMIN</h2>
      <ul>
        <li>
          <Link
            to="/"
            className={selected === '/' ? 'selected' : ''}
            onClick={() => handleSelect('/')}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/registro"
            className={selected === '/registro' ? 'selected' : ''}
            onClick={() => handleSelect('/registro')}
          >
            Registro
          </Link>
        </li>
        <li>
          <Link
            to="/calendar"
            className={selected === '/calendar' ? 'selected' : ''}
            onClick={() => handleSelect('/calendar')}
          >
            Calendar
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className={selected === '/reports' ? 'selected' : ''}
            onClick={() => handleSelect('/reports')}
          >
            Reports
          </Link>
        </li>
        <li>
          <Link
            to="/administracion"
            className={selected === '/administracion' ? 'selected' : ''}
            onClick={() => handleSelect('/administracion')}
          >
            Administración
          </Link>
        </li>
        <li>
          <Link
            to="/Reconocimiento"
            className={selected === '/Reconocimiento' ? 'selected' : ''}
            onClick={() => handleSelect('/Reconocimiento')}
          >
            Reconocimiento
          </Link>
        </li>
        <li>
          <Link
            to="/RegistroN"
            className={selected === '/RegistroN' ? 'selected' : ''}
            onClick={() => handleSelect('/RegistroN')}
          >
            RegistroN
          </Link>
        </li>
        <li>
          <Link
            to="/Entrenamiento"
            className={selected === '/Entrenamiento' ? 'selected' : ''}
            onClick={() => handleSelect('/Entrenamiento')}
          >
            Entrenamiento
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
