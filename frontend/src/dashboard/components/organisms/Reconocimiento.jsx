import React, { useRef, useState } from "react";

function Reconocimiento() {
  const videoRef = useRef(null);
  const [recognizedUser, setRecognizedUser] = useState(null);
  const [confidence, setConfidence] = useState(null);

  // URL base del backend
  const BASE_URL = "http://127.0.0.1:5000";

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error al iniciar la cámara:", err);
        alert("No se pudo acceder a la cámara.");
      });
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
  };

  const handleRecognize = async () => {
    const capturedImage = captureImage();

    try {
      const response = await fetch(`${BASE_URL}/api/reconocimiento/`, { // Usamos BASE_URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagen: capturedImage }),
      });

      const result = await response.json();
      if (response.ok) {
        setRecognizedUser(result.usuario);
        setConfidence(result.confianza);
        alert(
          `Usuario reconocido: ${result.usuario}, Confianza: ${result.confianza}`
        );
      } else {
        alert(result.message || "No se pudo reconocer el rostro.");
      }
    } catch (error) {
      console.error("Error durante el reconocimiento:", error);
      alert("Error durante el reconocimiento.");
    }
  };

  return (
    <div className="recognition-container">
      <h1>Reconocimiento Facial</h1>
      <video ref={videoRef} autoPlay onCanPlay={startCamera}></video>
      <button onClick={handleRecognize}>Reconocer Usuario</button>
      {recognizedUser && (
        <div>
          <p>Usuario: {recognizedUser}</p>
          <p>Confianza: {confidence}</p>
        </div>
      )}
    </div>
  );
}

export default Reconocimiento;
