import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendario.css";

const Calendario = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [newEntry, setNewEntry] = useState({
    nombre: "",
    saga: "",
    paralelo: "",
    estado: "",
    carrera: "",
  });

  // Fetch asistencia para una fecha específica
  const fetchAsistencia = async (fecha) => {
    try {
      const response = await fetch(`/api/asistencia?fecha=${fecha}`);
      const data = await response.json();
      if (data.status === "success") {
        setEstudiantes(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al obtener asistencia:", error);
    }
  };

  // Manejar clic en un día
  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    fetchAsistencia(formattedDate);
  };

  // Añadir nuevo registro
  const handleSaveRecord = async () => {
    try {
      const newFecha = selectedDate || new Date().toISOString().split("T")[0];
      const nuevoRegistro = { ...newEntry, fecha: newFecha };

      const response = await fetch("/api/asistencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoRegistro),
      });

      const data = await response.json();
      if (data.status === "success") {
        fetchAsistencia(newFecha); // Actualiza los registros después de añadir
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
    }
  };

  return (
    <div className="calendar-wrapper">
      <h2>Calendario de Asistencia</h2>
      <div className="calendar-content">
        <Calendar onClickDay={handleDateClick} />
      </div>

      {selectedDate && (
        <div>
          <h3>Asistencia para {selectedDate}</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Saga</th>
                <th>Paralelo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => (
                <tr key={estudiante.id}>
                  <td>{estudiante.id}</td>
                  <td>{estudiante.nombre}</td>
                  <td>{estudiante.saga}</td>
                  <td>{estudiante.paralelo}</td>
                  <td>{estudiante.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <h3>Añadir Registro</h3>
        <input
          placeholder="Nombre"
          value={newEntry.nombre}
          onChange={(e) => setNewEntry({ ...newEntry, nombre: e.target.value })}
        />
        <input
          placeholder="Saga"
          value={newEntry.saga}
          onChange={(e) => setNewEntry({ ...newEntry, saga: e.target.value })}
        />
        <button onClick={handleSaveRecord}>Guardar</button>
      </div>
    </div>
  );
};

export default Calendario;
