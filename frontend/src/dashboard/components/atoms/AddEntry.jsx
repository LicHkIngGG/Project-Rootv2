import React, { useState } from "react";

const AddEntry = ({ selectedDate, paralelos, carreras, fetchAsistencia }) => {
  const [newEntry, setNewEntry] = useState({
    nombre: "",
    saga: "",
    paralelo: "",
    estado: "",
    carrera_id: "",
  });

  const handleSaveRecord = async () => {
    if (!selectedDate) {
      alert("Seleccione una fecha");
      return;
    }

    try {
      const response = await fetch("/api/asistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEntry, fecha: selectedDate }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Registro añadido");
        fetchAsistencia(selectedDate);
      } else {
        console.error(data.message);
        alert("Error al añadir registro");
      }
    } catch (error) {
      console.error("Error al guardar registro:", error);
    }
  };

  return (
    <div className="add-entry">
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
      <select
        value={newEntry.paralelo}
        onChange={(e) => setNewEntry({ ...newEntry, paralelo: e.target.value })}
      >
        <option value="">Seleccionar Paralelo</option>
        {paralelos.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <select
        value={newEntry.carrera_id}
        onChange={(e) =>
          setNewEntry({ ...newEntry, carrera_id: e.target.value })
        }
      >
        <option value="">Seleccionar Carrera</option>
        {carreras.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
      <select
        value={newEntry.estado}
        onChange={(e) => setNewEntry({ ...newEntry, estado: e.target.value })}
      >
        <option value="">Seleccionar Estado</option>
        <option value="Presente">Presente</option>
        <option value="Ausente">Ausente</option>
      </select>
      <button onClick={handleSaveRecord}>Guardar</button>
    </div>
  );
};

export default AddEntry;
