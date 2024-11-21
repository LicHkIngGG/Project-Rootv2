import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Filters from "../atoms/Filters";
import AddEntry from "../atoms/AddEntry";
import AttendanceTable from "../atoms/AttendanceTable";
import "./Calendario.css";

const Calendario = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [filters, setFilters] = useState({ paralelo: "", carrera_id: "" });
  const [carreras, setCarreras] = useState([]);

  // Obtener carreras al cargar la página
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await fetch("/api/carreras");
        const data = await response.json();
        if (data.status === "success") setCarreras(data.data);
        else console.error(data.message);
      } catch (error) {
        console.error("Error al obtener carreras:", error);
      }
    };
    fetchCarreras();
  }, []);

  // Obtener asistencia
  const fetchAsistencia = async (fecha, paralelo = "", carrera_id = "") => {
    try {
      const query = new URLSearchParams({ fecha, paralelo, carrera_id }).toString();
      const response = await fetch(`/api/asistencia?${query}`);
      const data = await response.json();
      if (data.status === "success") setEstudiantes(data.data);
      else console.error(data.message);
    } catch (error) {
      console.error("Error al obtener asistencia:", error);
    }
  };

  // Manejar clic en una fecha
  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    fetchAsistencia(formattedDate, filters.paralelo, filters.carrera_id);
  };

  // Manejar cambios en filtros
  const handleFilterChange = (value, type) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    if (selectedDate) fetchAsistencia(selectedDate, newFilters.paralelo, newFilters.carrera_id);
  };

  return (
    <div className="calendar-container">
      {/* Texto principal */}
      <h1 className="page-title">Contenido principal</h1>
      
      {/* Contenedor del calendario */}
      <div className="calendar-section">
        <h2>Calendario de Asistencia</h2>
        <Calendar onClickDay={handleDateClick} />
        
        {/* Filtros */}
        <Filters
          paralelos={[
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
          ]}
          carreras={carreras}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        {/* Agregar nuevo registro */}
        <AddEntry
          selectedDate={selectedDate}
          carreras={carreras}
          paralelos={[
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
          ]}
          fetchAsistencia={fetchAsistencia}
        />
      </div>

      {/* Tabla de asistencia */}
      <AttendanceTable selectedDate={selectedDate} estudiantes={estudiantes} />
    </div>
  );
};

export default Calendario;
