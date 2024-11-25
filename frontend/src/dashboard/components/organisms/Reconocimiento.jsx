import React, { useRef, useState, useEffect } from "react";

function Reconocimiento() {
  const videoRef = useRef(null);
  const [recognizedUser, setRecognizedUser] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false); // Verifica si la cámara está activa

  // URL base del backend
  const BASE_URL = "http://127.0.0.1:5000";

  // Habilitar la cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      console.log("Cámara habilitada correctamente.");
    } catch (err) {
      console.error("Error al iniciar la cámara:", err);
      alert("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  };

  // Deshabilitar la cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
      console.log("Cámara deshabilitada.");
    }
  };

  // Validar estado de permisos de la cámara
  useEffect(() => {
    navigator.permissions.query({ name: "camera" }).then((result) => {
      if (result.state === "denied") {
        alert("Permiso de cámara denegado. Habilítalo en la configuración del navegador.");
      }
    });
  }, []);

  // Capturar imagen desde el video
  const captureImage = () => {
    const video = videoRef.current;

    // Verifica si el video está disponible y correctamente configurado
    if (!video || !video.srcObject) {
        alert("La cámara no está activa. Por favor, inicia la cámara.");
        return null;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert("El video no tiene dimensiones válidas. Asegúrate de que la cámara esté funcionando.");
        return null;
    }

    // Crea un canvas y dibuja el cuadro actual del video
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Log para verificar que se captura una nueva imagen
    console.log("Imagen capturada correctamente.");
    
    return canvas.toDataURL("image/jpeg"); // Retorna la imagen codificada en Base64
};


  // Manejar el reconocimiento facial
  const handleRecognize = async () => {
    const capturedImage = captureImage();
    if (!capturedImage) {
        console.error("No se pudo capturar la imagen.");
        return; // No procede con la solicitud si no hay imagen
    }

    try {
        const response = await fetch(`${BASE_URL}/api/reconocimiento/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imagen: capturedImage }),
        });

        const result = await response.json();
        if (response.ok) {
            setRecognizedUser(result.usuario);
            setConfidence(result.confianza);
            alert(`Usuario reconocido: ${result.usuario}, Confianza: ${result.confianza}`);
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
      <video ref={videoRef} autoPlay muted></video>
      <div>
        {!isCameraActive ? (
          <button onClick={startCamera}>Activar Cámara</button>
        ) : (
          <button onClick={stopCamera}>Detener Cámara</button>
        )}
        <button onClick={handleRecognize} disabled={!isCameraActive}>
          Reconocer Usuario
        </button>
      </div>
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
