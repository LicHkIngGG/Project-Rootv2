import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [user, setUser] = useState(null); // Información del usuario
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  // Verifica si hay un token en localStorage al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simula la validación del token (puedes implementar una solicitud real al backend)
      const userData = JSON.parse(localStorage.getItem('userData'));
      setIsAuthenticated(true);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        // Guardar token e información del usuario en localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        return true;
      } else {
        console.error('Error en login:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpiar localStorage y estados
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Proveer el contexto a los componentes hijos
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
