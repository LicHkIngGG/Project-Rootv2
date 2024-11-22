from flask import Blueprint, request, jsonify
from extensions import mysql

# Crear el blueprint para carreras
carreras_bp = Blueprint('carreras', __name__)

# Ruta para obtener todas las carreras
@carreras_bp.route('/api/carreras', methods=['GET'])
def obtener_carreras():
    try:
        # Consulta para obtener todas las carreras
        query = "SELECT id, nombre FROM carreras"
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()

        # Formatear los resultados en un JSON
        carreras = [{"id": row[0], "nombre": row[1]} for row in result]
        return jsonify({"status": "success", "data": carreras}), 200
    except Exception as e:
        print(f"Error al obtener carreras: {e}")
        return jsonify({"status": "error", "message": "Error al obtener carreras"}), 500


# Ruta para añadir una nueva carrera
@carreras_bp.route('/api/carreras', methods=['POST'])
def añadir_carrera():
    try:
        # Datos recibidos desde el frontend
        data = request.json
        nueva_carrera = data.get('nombre')

        if not nueva_carrera:
            return jsonify({"status": "error", "message": "El nombre de la carrera es obligatorio"}), 400

        # Verificar si la carrera ya existe
        cursor = mysql.connection.cursor()
        query_verificar = "SELECT COUNT(*) FROM carreras WHERE nombre = %s"
        cursor.execute(query_verificar, (nueva_carrera,))
        existe = cursor.fetchone()[0]

        if existe > 0:
            return jsonify({"status": "error", "message": "La carrera ya existe"}), 400

        # Insertar la nueva carrera
        query_insertar = "INSERT INTO carreras (nombre) VALUES (%s)"
        cursor.execute(query_insertar, (nueva_carrera,))
        mysql.connection.commit()
        nueva_id = cursor.lastrowid
        cursor.close()

        # Devolver la nueva carrera añadida
        return jsonify({
            "status": "success",
            "message": "Carrera añadida con éxito",
            "data": {"id": nueva_id, "nombre": nueva_carrera}
        }), 201
    except Exception as e:
        print(f"Error al añadir carrera: {e}")
        return jsonify({"status": "error", "message": "Error al añadir carrera"}), 500


# Ruta para eliminar una carrera (opcional, por si necesitas esta funcionalidad)
@carreras_bp.route('/api/carreras/<int:id>', methods=['DELETE'])
def eliminar_carrera(id):
    try:
        cursor = mysql.connection.cursor()

        # Verificar si la carrera existe antes de eliminar
        query_verificar = "SELECT COUNT(*) FROM carreras WHERE id = %s"
        cursor.execute(query_verificar, (id,))
        existe = cursor.fetchone()[0]

        if existe == 0:
            return jsonify({"status": "error", "message": "La carrera no existe"}), 404

        # Eliminar la carrera
        query_eliminar = "DELETE FROM carreras WHERE id = %s"
        cursor.execute(query_eliminar, (id,))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"status": "success", "message": "Carrera eliminada con éxito"}), 200
    except Exception as e:
        print(f"Error al eliminar carrera: {e}")
        return jsonify({"status": "error", "message": "Error al eliminar carrera"}), 500


# Ruta para actualizar una carrera (opcional, si necesitas esta funcionalidad)
@carreras_bp.route('/api/carreras/<int:id>', methods=['PUT'])
def actualizar_carrera(id):
    try:
        data = request.json
        nuevo_nombre = data.get('nombre')

        if not nuevo_nombre:
            return jsonify({"status": "error", "message": "El nuevo nombre es obligatorio"}), 400

        cursor = mysql.connection.cursor()

        # Verificar si la carrera existe
        query_verificar = "SELECT COUNT(*) FROM carreras WHERE id = %s"
        cursor.execute(query_verificar, (id,))
        existe = cursor.fetchone()[0]

        if existe == 0:
            return jsonify({"status": "error", "message": "La carrera no existe"}), 404

        # Actualizar la carrera
        query_actualizar = "UPDATE carreras SET nombre = %s WHERE id = %s"
        cursor.execute(query_actualizar, (nuevo_nombre, id))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"status": "success", "message": "Carrera actualizada con éxito"}), 200
    except Exception as e:
        print(f"Error al actualizar carrera: {e}")
        return jsonify({"status": "error", "message": "Error al actualizar carrera"}), 500
