import React from "react";

const AttendanceTable = ({ selectedDate, estudiantes }) => {
  if (!selectedDate) {
    return <p>Seleccione un día para ver la asistencia.</p>;
  }

  if (estudiantes.length === 0) {
    return <p>No hay registros para esta fecha.</p>;
  }

  return (
    <div className="attendance-table">
      <h3>Asistencia para {selectedDate}</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Saga</th>
            <th>Paralelo</th>
            <th>Carrera</th>
            <th>Estado</th>
            <th>Hora de Registro</th> {/* Nueva columna para la hora */}
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id}>
              <td>{estudiante.id}</td>
              <td>{estudiante.nombre}</td>
              <td>{estudiante.saga}</td>
              <td>{estudiante.paralelo}</td>
              <td>{estudiante.carrera}</td>
              <td>{estudiante.estado}</td>
              <td>{new Date(estudiante.fecha).toLocaleTimeString()}</td> {/* Formato de hora */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
