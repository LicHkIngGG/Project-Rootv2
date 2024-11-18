import React from 'react';
import Sidebar from '../organisms/Sidebar';
import './DashboardLayout.css'; // Importación del CSS

const DashboardLayout = ({ children }) => (
  <div className="dashboard-layout">
    <Sidebar />
    <div className="content">
      {children}
    </div>
  </div>
);

export default DashboardLayout;
