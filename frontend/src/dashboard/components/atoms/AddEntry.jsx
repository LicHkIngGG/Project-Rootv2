import React, { useState } from "react";

const AddEntry = ({ selectedDate, carreras, paralelos, fetchAsistencia }) => {
  const [newEntry, setNewEntry] = useState({
    name: "",
    saga: "",
    paralelo: "",
    carrera_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Seleccione una fecha primero.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/asistencia/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newEntry, fecha: selectedDate }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Registro añadido con éxito.");
        fetchAsistencia(selectedDate); // Actualizar la lista de asistencia
        setNewEntry({ name: "", saga: "", paralelo: "", carrera_id: "" });
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
          placeholder="Nombre"
          value={newEntry.name}
          onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Código Saga"
          value={newEntry.saga}
          onChange={(e) => setNewEntry({ ...newEntry, saga: e.target.value })}
          required
        />
        <select
          value={newEntry.paralelo}
          onChange={(e) => setNewEntry({ ...newEntry, paralelo: e.target.value })}
          required
        >
          <option value="">Seleccionar Paralelo</option>
          {paralelos.map((paralelo) => (
            <option key={paralelo.id} value={paralelo.nombre}>
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
        <button type="submit">Añadir</button>
      </form>
    </div>
  );
};

export default AddEntry;
