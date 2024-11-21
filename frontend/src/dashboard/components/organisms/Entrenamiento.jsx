import React, { useState } from "react";
import "./Entrenamiento.css";

function Entrenamiento() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTrain = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const response = await fetch("/api/train", { method: "POST" });
      const result = await response.json();
      setSuccess(true);
      alert(result.message);
    } catch (error) {
      alert("Ocurrió un error durante el entrenamiento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="training-container">
      <h1 className="training-title">Entrenamiento de Reconocimiento Facial</h1>
      <p className="training-description">
        Este proceso entrenará el modelo de reconocimiento facial con los datos registrados.
      </p>
      <div className="button-container">
        <button className={`train-button ${loading ? "loading" : ""}`} onClick={handleTrain} disabled={loading}>
          {loading ? "Entrenando..." : "Iniciar Entrenamiento"}
        </button>
        {success && <p className="success-message">¡Entrenamiento completado con éxito!</p>}
      </div>
      {loading && <div className="loading-animation"></div>}
    </div>
  );
}

export default Entrenamiento;
