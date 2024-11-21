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
  const [newCarrera, setNewCarrera] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Cambiar esta URL a la IP de tu servidor
  const BASE_URL = "http://127.0.0.1:5000";

  // Obtener carreras al cargar la página
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/carreras`);
        const data = await response.json();
        if (data.status === "success") {
          setCarreras(data.data);
          console.log("Carreras recibidas:", data.data); // Confirmar datos
        } else {
          console.error(data.message);
        }
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
      const response = await fetch(`${BASE_URL}/api/asistencia?${query}`);
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

  // Añadir nueva carrera
  const handleAddCarrera = async () => {
    if (!newCarrera.trim()) {
      alert("El nombre de la carrera no puede estar vacío.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/carreras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: newCarrera }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Carrera añadida con éxito.");
        setCarreras([...carreras, newCarrera]);
        setNewCarrera("");
        setShowModal(false);
      } else {
        alert(data.message || "Error al añadir la carrera.");
      }
    } catch (error) {
      console.error("Error al añadir carrera:", error);
      alert("Error al añadir la carrera.");
    }
  };

  return (
    <div className="calendar-container">
      <h1 className="page-title">Contenido principal</h1>

      {/* Botón para añadir carrera */}
      <button className="add-carrera-button" onClick={() => setShowModal(true)}>
        Añadir Carrera
      </button>

      {/* Modal para añadir carrera */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Añadir Nueva Carrera</h2>
            <input
              type="text"
              placeholder="Nombre de la carrera"
              value={newCarrera}
              onChange={(e) => setNewCarrera(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAddCarrera}>Guardar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="calendar-section">
        <h2>Calendario de Asistencia</h2>
        <Calendar onClickDay={handleDateClick} />
        <h3>Filtrar por Carrera</h3>
        <select>
          <option value="">Seleccionar Carrera</option>
          {carreras &&
          carreras.map((carrera, index) => (
          <option key={index} value={carrera.nombre}>
          {carrera.nombre}
          </option>
        ))}
        </select>


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

      <AttendanceTable selectedDate={selectedDate} estudiantes={estudiantes} />
    </div>
  );
};

export default Calendario;
