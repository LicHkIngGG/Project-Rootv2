import React, { useState, useEffect, useRef } from "react";

function RegistroN() {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo_saga: "",
    paralelo_id: "",
    carrera_id: "",
  });
  const [paralelos, setParalelos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Obtener paralelos
    fetch("http://127.0.0.1:5000/api/paralelos")
      .then((res) => res.json())
      .then((data) => setParalelos(data.data))
      .catch((err) => console.error(err));

    // Obtener carreras
    fetch("http://127.0.0.1:5000/api/carreras")
      .then((res) => res.json())
      .then((data) => setCarreras(data.data))
      .catch((err) => console.error(err));
  }, []);

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
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureImagesAutomatically = () => {
    if (!isCameraActive) {
      alert("Primero activa la cámara.");
      return;
    }

    if (isCapturing) {
      alert("Ya está en proceso de captura automática.");
      return;
    }

    if (capturedImages.length >= 10) {
      alert("Ya has capturado 10 imágenes.");
      return;
    }

    setIsCapturing(true);

    let imagesCaptured = 0;
    const interval = setInterval(() => {
      if (imagesCaptured >= 10) {
        clearInterval(interval);
        setIsCapturing(false);
        alert("Captura automática completada.");
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImages((prev) => [...prev, dataUrl]);
      imagesCaptured += 1;
    }, 500); // Captura una imagen cada 500 ms
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (capturedImages.length < 10) {
      alert("Por favor, captura al menos 10 imágenes antes de registrar.");
      return;
    }
  
    const payload = { ...formData, imagenes: capturedImages };
    try {
      const response = await fetch("http://127.0.0.1:5000/api/registro/register", { // Cambié la URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Estudiante registrado con éxito.");
        setFormData({ nombre: "", codigo_saga: "", paralelo_id: "", carrera_id: "" });
        setCapturedImages([]);
        stopCamera();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error("Error al registrar estudiante:", err);
    }
  };
  

  return (
    <div>
      <h1>Registro de Estudiantes</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />

        <label>Código Saga:</label>
        <input
          type="text"
          value={formData.codigo_saga}
          onChange={(e) => setFormData({ ...formData, codigo_saga: e.target.value })}
          required
        />

        <label>Paralelo:</label>
        <select
          value={formData.paralelo_id}
          onChange={(e) => setFormData({ ...formData, paralelo_id: e.target.value })}
          required
        >
          <option value="">Seleccione</option>
          {paralelos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        <label>Carrera:</label>
        <select
          value={formData.carrera_id}
          onChange={(e) => setFormData({ ...formData, carrera_id: e.target.value })}
          required
        >
          <option value="">Seleccione</option>
          {carreras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <div>
          <h3>Captura de Imágenes</h3>
          <video ref={videoRef} autoPlay muted></video>
          <p>Imágenes capturadas: {capturedImages.length}/10</p>
          {!isCameraActive ? (
            <button type="button" onClick={startCamera}>
              Iniciar Cámara
            </button>
          ) : (
            <button type="button" onClick={stopCamera}>
              Detener Cámara
            </button>
          )}
          <button
            type="button"
            onClick={captureImagesAutomatically}
            disabled={isCapturing}
          >
            {isCapturing ? "Capturando..." : "Capturar Automáticamente"}
          </button>
        </div>

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default RegistroN;
