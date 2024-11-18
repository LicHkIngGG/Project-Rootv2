import React from 'react';

function Entrenamiento() {
    const handleTrain = async () => {
        const response = await fetch('/api/train', { method: 'POST' });
        const result = await response.json();
        alert(result.message);
    };

    return (
        <div>
            <h1>Entrenamiento</h1>
            <button onClick={handleTrain}>Iniciar Entrenamiento</button>
        </div>
    );
}

export default Entrenamiento;
