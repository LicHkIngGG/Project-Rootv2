import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import './Reportes.css';

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

const Reportes = () => {
  const [asistenciaData, setAsistenciaData] = useState([]);
  const [aperturaData, setAperturaData] = useState([]);
  const [filtroAsistencia, setFiltroAsistencia] = useState('mes'); // Filtro inicial para asistencia

  // Función para manejar el cambio de filtro de asistencia
  const handleFiltroAsistenciaChange = async (event) => {
    const nuevoFiltro = event.target.value;
    setFiltroAsistencia(nuevoFiltro);
    await fetchAsistenciaData(nuevoFiltro);
  };

  // Función para obtener datos de asistencia desde el backend
  const fetchAsistenciaData = async (filtro) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/reportes/asistencia?filtro=${filtro}`);
      const data = await response.json();
      if (data.status === 'success') {
        setAsistenciaData(data.data);
      } else {
        console.error('Error al obtener datos de asistencia:', data.message);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  // Función para obtener datos de apertura desde el backend
  const fetchAperturaData = async () => {
    try {
      const response = await fetch('http://192.168.40.102:5000/api/reportes/apertura');
      const data = await response.json();
      if (data.status === 'success') {
        setAperturaData(data.data);
      } else {
        console.error('Error al obtener datos de apertura:', data.message);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAsistenciaData(filtroAsistencia);
    fetchAperturaData();
  }, [filtroAsistencia]);

  return (
    <div className="dashboard-reportes">
      <div className="grafica-container">
        <h2>Estadísticas de Asistencia</h2>
        <div className="filtro-container">
          <label htmlFor="filtro-asistencia">Seleccionar intervalo:</label>
          <select
            id="filtro-asistencia"
            value={filtroAsistencia}
            onChange={handleFiltroAsistenciaChange}
          >
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
          </select>
        </div>
        <PieChart width={400} height={400}>
          <Pie
            data={asistenciaData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {asistenciaData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>

      <div className="grafica-container">
        <h2>Aperturas por Semana</h2>
        <BarChart
          width={500}
          height={300}
          data={aperturaData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Aperturas" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  );
};

export default Reportes;
