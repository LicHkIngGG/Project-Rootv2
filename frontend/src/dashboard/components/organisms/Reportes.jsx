import React, { useState, useEffect } from "react";
import "./Reportes.css";

const BASE_URL = "http://127.0.0.1:5000"; // URL del backend

const Reportes = () => {
  const [filtroAsistencia, setFiltroAsistencia] = useState("mes");
  const [carrera, setCarrera] = useState("");
  const [paralelo, setParalelo] = useState("");
  const [asistenciaData, setAsistenciaData] = useState([]);
  const [aperturaData, setAperturaData] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [paralelos, setParalelos] = useState([]); // Nueva lista de paralelos desde el backend

  // Cargar carreras y paralelos al montar el componente
  useEffect(() => {
    fetchCarreras();
    fetchParalelos();
  }, []);

  const fetchCarreras = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/carreras`);
      const data = await response.json();
      if (data.status === "success") {
        setCarreras(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al obtener carreras:", error);
    }
  };

  const fetchParalelos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/paralelos`);
      const data = await response.json();
      if (data.status === "success") {
        setParalelos(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al obtener paralelos:", error);
    }
  };

  const fetchAsistencia = async () => {
    try {
      const query = new URLSearchParams({
        filtro: filtroAsistencia,
        carrera,
        paralelo,
      }).toString();
      const response = await fetch(`${BASE_URL}/api/reportes/asistencia?${query}`);
      const data = await response.json();
      if (data.status === "success") {
        setAsistenciaData(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al obtener estadísticas de asistencia:", error);
    }
  };

  const fetchAperturas = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/reportes/apertura`);
      const data = await response.json();
      if (data.status === "success") {
        setAperturaData(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al obtener estadísticas de aperturas:", error);
    }
  };

  // Actualizar datos cada vez que cambien los filtros
  useEffect(() => {
    fetchAsistencia();
    fetchAperturas();
  }, [filtroAsistencia, carrera, paralelo]);

  return (
    <div className="reportes-container">
      <h1 className="reportes-title">Reportes</h1>

      {/* Reporte de Asistencia */}
      <section className="reporte-section">
        <h2 className="section-title">Reporte de Asistencia</h2>
        <div className="filtro-container">
          <div className="filtro-item">
            <label>Filtro de Fecha:</label>
            <select
              onChange={(e) => setFiltroAsistencia(e.target.value)}
              value={filtroAsistencia}
            >
              <option value="dia">Día</option>
              <option value="semana">Semana</option>
              <option value="mes">Mes</option>
            </select>
          </div>
          <div className="filtro-item">
            <label>Carrera:</label>
            <select
              onChange={(e) => setCarrera(e.target.value)}
              value={carrera}
            >
              <option value="">Todas las Carreras</option>
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="filtro-item">
            <label>Paralelo:</label>
            <select
              onChange={(e) => setParalelo(e.target.value)}
              value={paralelo}
            >
              <option value="">Todos los Paralelos</option>
              {paralelos.map((paralelo) => (
                <option key={paralelo.id} value={paralelo.id}>
                  {paralelo.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="resultados-container">
          <h3>Resultados de Asistencia</h3>
          {asistenciaData.length > 0 ? (
            <ul>
              {asistenciaData.map((item, index) => (
                <li key={index}>
                  {item.name}: {item.value}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </div>
      </section>

      {/* Reporte de Aperturas */}
      <section className="reporte-section">
        <h2 className="section-title">Reporte de Aperturas</h2>
        <div className="resultados-container">
          <h3>Resultados de Aperturas</h3>
          {aperturaData.length > 0 ? (
            <ul>
              {aperturaData.map((item, index) => (
                <li key={index}>
                  {item.name}: {item.Aperturas}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reportes;
