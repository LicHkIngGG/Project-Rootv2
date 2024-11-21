from flask import Blueprint, request, jsonify
from extensions import mysql

# Crear el blueprint para carreras
carreras_bp = Blueprint('carreras', __name__)

@carreras_bp.route('/', methods=['GET'])
def obtener_carreras():
    try:
        query = "SELECT id, nombre FROM carreras"
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()

        carreras = [{"id": row[0], "nombre": row[1]} for row in result]
        return jsonify({"status": "success", "data": carreras}), 200
    except Exception as e:
        print(f"Error al obtener carreras: {e}")
        return jsonify({"status": "error", "message": "Error al obtener carreras"}), 500


@carreras_bp.route('/api/carreras', methods=['POST'])
def añadir_carrera():
    try:
        data = request.json
        nueva_carrera = data.get('nombre')

        if not nueva_carrera:
            return jsonify({"status": "error", "message": "El nombre de la carrera es obligatorio"}), 400

        # Verificar si la carrera ya existe
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM carreras WHERE nombre = %s", (nueva_carrera,))
        existe = cursor.fetchone()[0]

        if existe > 0:
            return jsonify({"status": "error", "message": "La carrera ya existe"}), 400

        # Insertar la nueva carrera
        query = "INSERT INTO carreras (nombre) VALUES (%s)"
        cursor.execute(query, (nueva_carrera,))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"status": "success", "message": "Carrera añadida con éxito"}), 201
    except Exception as e:
        print(f"Error al añadir carrera: {e}")
        return jsonify({"status": "error", "message": "Error al añadir carrera"}), 500
