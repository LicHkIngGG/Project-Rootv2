import React, { useState, useEffect } from "react";
import "./Reportes.css";

const Reportes = () => {
  const [filtroAsistencia, setFiltroAsistencia] = useState("mes");
  const [carrera, setCarrera] = useState("");
  const [paralelo, setParalelo] = useState("");
  const [asistenciaData, setAsistenciaData] = useState([]);
  const [aperturaData, setAperturaData] = useState([]);
  const [carreras, setCarreras] = useState([]);

  const paralelos = [
    "1er semestre",
    "2do semestre",
    "3er semestre",
    "4to semestre",
    "5to semestre",
    "6to semestre",
    "7mo semestre",
    "8vo semestre",
    "9no semestre",
    "10mo semestre",
  ];

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await fetch("/api/carreras");
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

    fetchCarreras();
  }, []);

  const fetchAsistencia = async () => {
    try {
      const query = new URLSearchParams({
        filtro: filtroAsistencia,
        carrera,
        paralelo,
      }).toString();
      const response = await fetch(`/api/reportes/asistencia?${query}`);
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
      const response = await fetch(`/api/reportes/apertura`);
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
              {carreras.map((carrera, index) => (
                <option key={index} value={carrera}>
                  {carrera}
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
              {paralelos.map((p, index) => (
                <option key={index} value={p}>
                  {p}
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
