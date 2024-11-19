import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://192.168.40.12:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setIsAuthenticated(true);
        setUser(data.user);
        return true;
      } else {
        alert(data.message || 'Error al iniciar sesión');
        return false;
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      alert('Error al conectar con el servidor');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
