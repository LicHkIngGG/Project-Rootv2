import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(username, password);
    setLoading(false);

    if (success) {
      navigate('/administracion');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      {/* Fondo interactivo de puntos */}
      <div className="background-particles"></div>
      <div className="login-content">
        <div className="login-box">
          <h1 className="title">Escuela Militar de Ingeniería</h1>
          <h2 className="subtitle">Sistema de control de asistencia laboratorio</h2>
          <p className="description">¡Bienvenido! Por favor introduce tus datos</p>
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <label className="label" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="text"
              placeholder="Usuario"
              required
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="login-options">
              <label>
                <input type="checkbox" className="checkbox" /> Recordarme
              </label>
              <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Cargando...' : 'Login'}
            </button>
          </form>
        </div>
        <div className="login-logo">
          <img src="/logo-emii.png" alt="Logo EMI" className="logo-image" />
        </div>
      </div>
    </div>
  );
};

export default Login;

