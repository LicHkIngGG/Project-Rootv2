from flask import Blueprint, request, jsonify
from extensions import mysql

asistencia_bp = Blueprint('asistencia', __name__)

# Registrar asistencia
@asistencia_bp.route('/api/asistencia', methods=['POST'])
def registrar_asistencia():
    try:
        data = request.json
        nombre = data.get('nombre')
        saga = data.get('saga')
        paralelo = data.get('paralelo')
        estado = data.get('estado')
        carrera = data.get('carrera')
        fecha = data.get('fecha')  # Debe venir en formato 'YYYY-MM-DD'

        if not (nombre and saga and paralelo and estado and carrera and fecha):
            return jsonify({"status": "error", "message": "Todos los campos son obligatorios"}), 400

        cursor = mysql.connection.cursor()
        query = """
            INSERT INTO asistencia (usuario_id, curso, timestamp)
            VALUES (
                (SELECT id FROM usuarios WHERE nombre = %s AND codigo_saga = %s),
                %s,
                %s
            )
        """
        cursor.execute(query, (nombre, saga, paralelo, fecha))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"status": "success", "message": "Asistencia registrada"}), 201
    except Exception as e:
        print(f"Error al registrar asistencia: {e}")
        return jsonify({"status": "error", "message": "Error interno del servidor"}), 500

# Obtener asistencia por fecha
@asistencia_bp.route('/api/asistencia', methods=['GET'])
def obtener_asistencia():
    try:
        fecha = request.args.get('fecha')  # Formato 'YYYY-MM-DD'

        if not fecha:
            return jsonify({"status": "error", "message": "La fecha es requerida"}), 400

        cursor = mysql.connection.cursor()
        query = """
            SELECT
                usuarios.id AS id,
                usuarios.nombre AS nombre,
                usuarios.codigo_saga AS saga,
                asistencia.curso AS paralelo,
                asistencia.timestamp AS fecha
            FROM asistencia
            INNER JOIN usuarios ON asistencia.usuario_id = usuarios.id
            WHERE DATE(asistencia.timestamp) = %s
        """
        cursor.execute(query, (fecha,))
        registros = cursor.fetchall()
        cursor.close()

        # Formatear los datos para el frontend
        data = [
            {
                "id": row[0],
                "nombre": row[1],
                "saga": row[2],
                "paralelo": row[3],
                "fecha": row[4].strftime('%Y-%m-%d')
            }
            for row in registros
        ]

        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        print(f"Error al obtener asistencia: {e}")
        return jsonify({"status": "error", "message": "Error interno del servidor"}), 500
