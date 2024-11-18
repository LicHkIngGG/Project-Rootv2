import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PanelRegistroAsistencia.css';

const PanelRegistroAsistencia = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/asistencia');
                setData(response.data); 
                setLoading(false); 
            } catch (error) {
                console.error("Error al cargar los datos de asistencia:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Cargando datos de asistencia...</p>;
    }

    return (
        <div className="attendance-table">
            <h2>Registro de Asistencia</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Saga</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry) => (
                        <tr key={entry.id}>
                            <td>{entry.id}</td>
                            <td>{entry.nombre}</td>
                            <td>{entry.saga}</td>
                            <td>{new Date(entry.timestamp).toLocaleDateString()}</td>
                            <td>{entry.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PanelRegistroAsistencia;
