import React, { useRef } from 'react';

function Reconocimiento() {
    const videoRef = useRef(null);

    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            videoRef.current.srcObject = stream;
        });
    };

    const handleRecognize = async (capturedImage) => {
        const response = await fetch('/api/recognize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: capturedImage }),
        });
        const result = await response.json();
        alert(result.message);
    };

    return (
        <div>
            <h1>Reconocimiento Facial</h1>
            <video ref={videoRef} autoPlay onCanPlay={startCamera}></video>
        </div>
    );
}

export default Reconocimiento;
