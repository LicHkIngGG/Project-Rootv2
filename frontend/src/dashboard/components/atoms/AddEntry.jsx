import React, { useState } from "react";

const AddEntry = ({ selectedDate, carreras, paralelos, fetchAsistencia }) => {
  const [newEntry, setNewEntry] = useState({
    estudiante_id: "",
    codigo_saga: "",
    paralelo_id: "",
    carrera_id: "",
    estado: "Presente", // Valor predeterminado del desplegable
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Seleccione una fecha primero.");
      return;
    }

    if (!newEntry.estudiante_id || !newEntry.estado) {
      alert("Los campos estudiante_id y estado son obligatorios.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/asistencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estudiante_id: newEntry.estudiante_id,
          estado: newEntry.estado,
          fecha: selectedDate,
          paralelo_id: newEntry.paralelo_id,
          carrera_id: newEntry.carrera_id,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Registro añadido con éxito.");
        fetchAsistencia(selectedDate); // Actualizar la lista de asistencia
        setNewEntry({
          estudiante_id: "",
          codigo_saga: "",
          paralelo_id: "",
          carrera_id: "",
          estado: "Presente", // Restablecer al valor predeterminado
        });
      } else {
        alert(data.message || "Error al añadir el registro.");
      }
    } catch (error) {
      console.error("Error al añadir entrada:", error);
      alert("Error al añadir la entrada.");
    }
  };

  return (
    <div className="add-entry-form">
      <h3>Añadir Registro Manualmente</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID del Estudiante"
          value={newEntry.estudiante_id}
          onChange={(e) =>
            setNewEntry({ ...newEntry, estudiante_id: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Código Saga"
          value={newEntry.codigo_saga}
          onChange={(e) => setNewEntry({ ...newEntry, codigo_saga: e.target.value })}
          required
        />
        <select
          value={newEntry.paralelo_id}
          onChange={(e) => setNewEntry({ ...newEntry, paralelo_id: e.target.value })}
          required
        >
          <option value="">Seleccionar Paralelo</option>
          {paralelos.map((paralelo) => (
            <option key={paralelo.id} value={paralelo.id}>
              {paralelo.nombre}
            </option>
          ))}
        </select>
        <select
          value={newEntry.carrera_id}
          onChange={(e) => setNewEntry({ ...newEntry, carrera_id: e.target.value })}
          required
        >
          <option value="">Seleccionar Carrera</option>
          {carreras.map((carrera) => (
            <option key={carrera.id} value={carrera.id}>
              {carrera.nombre}
            </option>
          ))}
        </select>
        <select
          value={newEntry.estado}
          onChange={(e) => setNewEntry({ ...newEntry, estado: e.target.value })}
          required
        >
          <option value="Presente">Presente</option>
          <option value="Ausente">Ausente</option>
        </select>
        <button type="submit">Añadir</button>
      </form>
    </div>
  );
};

export default AddEntry;
