import React, { useState } from "react";

function Entrenamiento() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTrain = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/train", { method: "POST" });
      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        alert("Entrenamiento completado exitosamente.");
      } else {
        alert(result.message || "Error durante el entrenamiento.");
      }
    } catch (error) {
      console.error("Error durante el entrenamiento:", error);
      alert("Error al conectar con el backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="training-container">
      <h1>Entrenamiento de Reconocimiento</h1>
      <button onClick={handleTrain} disabled={loading}>
        {loading ? "Entrenando..." : "Iniciar Entrenamiento"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Entrenamiento;
