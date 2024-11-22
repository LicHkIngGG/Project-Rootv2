import React, { useState, useEffect, useRef } from "react";
import "./RegistroN.css";

const BASE_URL = "http://127.0.0.1:5000"; // URL del backend

function RegistroN() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    semester_id: "",
    career_id: "",
  });
  const [carreras, setCarreras] = useState([]);
  const [paralelos, setParalelos] = useState([]);
  const [capturedImageCount, setCapturedImageCount] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  // Cargar carreras y paralelos al cargar el componente
  useEffect(() => {
    fetchCarreras();
    fetchParalelos();
  }, []);

  const fetchCarreras = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/carreras`);
      const data = await response.json();
      if (data.status === "success") {
        setCarreras(data.data);
      } else {
        alert("Error al cargar carreras");
      }
    } catch (error) {
      console.error("Error al obtener carreras:", error);
    }
  };

  const fetchParalelos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/paralelos`);
      const data = await response.json();
      if (data.status === "success") {
        setParalelos(data.data);
      } else {
        alert("Error al cargar paralelos");
      }
    } catch (error) {
      console.error("Error al obtener paralelos:", error);
    }
  };

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

    setCapturedImageCount((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (capturedImageCount < 400) {
      alert("Asegúrate de capturar 400 imágenes antes de enviar.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/registro/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Usuario registrado con éxito.");
      } else {
        alert("Error al registrar usuario.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
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
          <select
            value={formData.semester_id}
            onChange={(e) =>
              setFormData({ ...formData, semester_id: e.target.value })
            }
            required
          >
            <option value="">Selecciona un semestre</option>
            {paralelos.map((paralelo) => (
              <option key={paralelo.id} value={paralelo.id}>
                {paralelo.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Carrera:
          <select
            value={formData.career_id}
            onChange={(e) =>
              setFormData({ ...formData, career_id: e.target.value })
            }
            required
          >
            <option value="">Selecciona una carrera</option>
            {carreras.map((carrera) => (
              <option key={carrera.id} value={carrera.id}>
                {carrera.nombre}
              </option>
            ))}
          </select>
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
