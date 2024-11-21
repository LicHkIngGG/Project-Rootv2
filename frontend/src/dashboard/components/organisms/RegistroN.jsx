import React, { useState, useRef, useEffect } from "react";
import "./RegistroN.css";

function RegistroN() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    semester: "",
    career: "",
  });

  const [capturedImageCount, setCapturedImageCount] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (capturedImageCount === 400) {
      alert("Captura completa: 400 imágenes guardadas");
    }
  }, [capturedImageCount]);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      })
      .catch((error) => {
        console.error("Error al acceder a la cámara:", error);
        alert("No se pudo acceder a la cámara.");
      });
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureImage = async () => {
    if (!isCameraActive) {
      alert("Primero inicia la cámara.");
      return;
    }

    if (capturedImageCount >= 400) {
      alert("Ya se han capturado 400 imágenes.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");

    try {
      const response = await fetch("http://192.168.0.10:5000/api/registro/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, image: dataUrl }),
      });

      if (response.ok) {
        setCapturedImageCount((prev) => prev + 1);
      } else {
        alert("Error al guardar la imagen en el backend.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos. Intenta nuevamente.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (capturedImageCount < 400) {
      alert("Asegúrate de capturar 400 imágenes antes de enviar.");
      return;
    }
    alert("Datos registrados correctamente.");
  };

  return (
    <div className="registro-container">
      <h1>Registro de Usuarios</h1>
      <form className="registro-form" onSubmit={handleSubmit}>
        <label>
          Nombres y Apellidos:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </label>
        <label>
          Código Saga:
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </label>
        <label>
          Semestre:
          <input
            type="text"
            value={formData.semester}
            onChange={(e) =>
              setFormData({ ...formData, semester: e.target.value })
            }
            required
          />
        </label>
        <label>
          Carrera:
          <input
            type="text"
            value={formData.career}
            onChange={(e) => setFormData({ ...formData, career: e.target.value })}
            required
          />
        </label>
        <div className="video-section">
          <video ref={videoRef} autoPlay></video>
          <div className="button-group">
            {isCameraActive ? (
              <button type="button" onClick={stopCamera}>
                Detener Cámara
              </button>
            ) : (
              <button type="button" onClick={startCamera}>
                Iniciar Cámara
              </button>
            )}
            <button type="button" onClick={captureImage}>
              Escanear Rostro
            </button>
          </div>
        </div>
        <p>Imágenes capturadas: {capturedImageCount}/400</p>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}

export default RegistroN;
