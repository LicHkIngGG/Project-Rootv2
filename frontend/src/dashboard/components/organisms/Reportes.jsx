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

  // Simulación de conexión a la base de datos para asistencia
  const fetchAsistenciaData = async (filtro) => {
    // Aquí deberás realizar la conexión a tu backend
    let fakeData;
    if (filtro === 'dia') {
      fakeData = [
        { name: 'Asiste', value: 5 },
        { name: 'No asiste', value: 3 },
      ];
    } else if (filtro === 'semana') {
      fakeData = [
        { name: 'Asiste', value: 25 },
        { name: 'No asiste', value: 15 },
      ];
    } else {
      fakeData = [
        { name: 'Asiste', value: 100 },
        { name: 'No asiste', value: 60 },
      ];
    }
    setAsistenciaData(fakeData);
  };

  // Simulación de conexión a la base de datos para apertura
  const fetchAperturaData = async () => {
    // Aquí deberás realizar la conexión a tu backend
    const fakeData = [
      { name: 'Semana 1', Aperturas: 5 },
      { name: 'Semana 2', Aperturas: 8 },
      { name: 'Semana 3', Aperturas: 4 },
      { name: 'Semana 4', Aperturas: 7 },
    ];
    setAperturaData(fakeData);
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

        {/* Filtro de intervalo de tiempo */}
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

        {/* Gráfica de torta para asistencia */}
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

        {/* Gráfica de barras para apertura */}
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
