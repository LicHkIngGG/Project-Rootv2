import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Estilos para el calendario
import "./Calendario.css";

const Calendario = () => {
  const [datosAsistencia, setDatosAsistencia] = useState([
    {
      id: 1,
      nombre: "Roberto Sea Maldonado",
      saga: "A24469-4",
      paralelo: "1er semestre",
      estado: "Presente",
      carrera: "Ing. Sistemas",
      fecha: "2024-11-18",
    },
    {
      id: 2,
      nombre: "Jose Rojas",
      saga: "A22359-0",
      paralelo: "2do semestre",
      estado: "Ausente",
      carrera: "Ing. Telecomunicaciones",
      fecha: "2024-11-18",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntry, setNewEntry] = useState({
    nombre: "",
    saga: "",
    paralelo: "",
    estado: "",
    carrera: "",
  });

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

  const carreras = [
    "Ing. Sistemas",
    "Ing. Telecomunicaciones",
    "Ing. Sist. Electrónicos",
  ];

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);

    const estudiantesFiltrados = datosAsistencia.filter(
      (entry) => entry.fecha === formattedDate
    );
    setEstudiantes(estudiantesFiltrados);
  };

  const handleAddRecord = () => {
    setModalVisible(true); // Mostrar el modal
  };

  const handleSaveRecord = () => {
    const newId = datosAsistencia.length + 1;
    const newFecha = selectedDate || new Date().toISOString().split("T")[0];
    const nuevoRegistro = { id: newId, ...newEntry, fecha: newFecha };

    setDatosAsistencia([...datosAsistencia, nuevoRegistro]);

    if (selectedDate) {
      const estudiantesFiltrados = datosAsistencia.filter(
        (entry) => entry.fecha === selectedDate
      );
      setEstudiantes([...estudiantesFiltrados, nuevoRegistro]);
    }

    setModalVisible(false); // Cerrar el modal
    setNewEntry({ nombre: "", saga: "", paralelo: "", estado: "", carrera: "" });
  };

  const handleFilter = (filtro, tipo) => {
    const estudiantesFiltrados = datosAsistencia.filter(
      (entry) => entry[tipo] === filtro && entry.fecha === selectedDate
    );
    setEstudiantes(estudiantesFiltrados);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nombre", "Saga", "Paralelo", "Estado", "Carrera"];
    const rows = estudiantes.map((estudiante) => [
      estudiante.id,
      estudiante.nombre,
      estudiante.saga,
      estudiante.paralelo,
      estudiante.estado,
      estudiante.carrera,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `asistencia_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="calendar-wrapper">
      <h2>Calendario de Asistencia</h2>
      <div className="calendar-content">
        <Calendar onClickDay={handleDateClick} />
        <div className="buttons">
          <button onClick={handleAddRecord}>Añadir Registro</button>
          <select onChange={(e) => handleFilter(e.target.value, "paralelo")}>
            <option value="">Filtrar por Paralelo</option>
            {paralelos.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select onChange={(e) => handleFilter(e.target.value, "carrera")}>
            <option value="">Filtrar por Carrera</option>
            {carreras.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button onClick={handleExportCSV}>Exportar CSV</button>
        </div>
      </div>

      {selectedDate && (
        <div className="attendance-details">
          <h3>Asistencia para {selectedDate}</h3>
          {estudiantes.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Saga</th>
                  <th>Paralelo</th>
                  <th>Estado</th>
                  <th>Carrera</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((estudiante) => (
                  <tr key={estudiante.id}>
                    <td>{estudiante.id}</td>
                    <td>{estudiante.nombre}</td>
                    <td>{estudiante.saga}</td>
                    <td>{estudiante.paralelo}</td>
                    <td>{estudiante.estado}</td>
                    <td>{estudiante.carrera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay registros para esta fecha.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendario;
