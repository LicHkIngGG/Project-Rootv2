import React from "react";

const Filters = ({ paralelos, carreras, filters, onFilterChange }) => {
  return (
    <div className="filters-and-actions">
      <h3>Filtrar Asistencia</h3>
      <select
        onChange={(e) => onFilterChange(e.target.value, "paralelo")}
        value={filters.paralelo}
      >
        <option value="">Filtrar por Paralelo</option>
        {paralelos.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => onFilterChange(e.target.value, "carrera_id")}
        value={filters.carrera_id}
      >
        <option value="">Filtrar por Carrera</option>
        {carreras.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
