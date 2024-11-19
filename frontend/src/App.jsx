import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './login/AuthContext';
import DashboardLayout from './dashboard/components/templates/DashboardLayout';
import EstadosPuertaPage from './dashboard/components/pages/EstadosPuertaPage';
import PanelRegistroAsistencia from './dashboard/components/organisms/PanelRegistroAsistencia';
import Calendario from './dashboard/components/organisms/Calendario';
import Reportes from './dashboard/components/organisms/Reportes';
import Reconocimiento from './dashboard/components/organisms/Reconocimiento';
import RegistroN from './dashboard/components/organisms/RegistroN';
import Entrenamiento from './dashboard/components/organisms/Entrenamiento';
import Login from './login/Login';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/registro" element={<PanelRegistroAsistencia />} />
                  <Route path="/calendar" element={<Calendario />} />
                  <Route path="/administracion" element={<EstadosPuertaPage />} />
                  <Route path="/reports" element={<Reportes />} />
                  <Route path="/reconocimiento" element={<Reconocimiento />} />
                  <Route path="/registroN" element={<RegistroN />} />
                  <Route path="/entrenamiento" element={<Entrenamiento />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;