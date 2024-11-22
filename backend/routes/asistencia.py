from flask import Blueprint, request, jsonify
from extensions import mysql

asistencia_bp = Blueprint("asistencia_bp", __name__)

# Obtener asistencia con filtros
@asistencia_bp.route("/api/asistencia", methods=["GET"])
def obtener_asistencia():
    try:
        fecha = request.args.get("fecha")
        paralelo = request.args.get("paralelo")
        carrera_id = request.args.get("carrera_id")

        if not fecha:
            return jsonify({"status": "error", "message": "La fecha es requerida"}), 400

        cursor = mysql.connection.cursor()
        query = """
            SELECT
                estudiantes.id AS id,
                estudiantes.nombre AS nombre,
                estudiantes.codigo_saga AS saga,
                estudiantes.paralelo_id AS paralelo,
                asistencia.estado AS estado,
                carreras.nombre AS carrera,
                asistencia.timestamp AS fecha
            FROM asistencia
            INNER JOIN estudiantes ON asistencia.usuario_id = estudiantes.id
            INNER JOIN carreras ON estudiantes.carrera_id = carreras.id
            WHERE DATE(asistencia.timestamp) = %s
        """
        params = [fecha]

        if paralelo:
            query += " AND estudiantes.paralelo_id = %s"
            params.append(paralelo)
        if carrera_id:
            query += " AND estudiantes.carrera_id = %s"
            params.append(carrera_id)

        cursor.execute(query, tuple(params))
        registros = cursor.fetchall()
        cursor.close()

        data = [
            {
                "id": row[0],
                "nombre": row[1],
                "saga": row[2],
                "paralelo": row[3],
                "estado": row[4],
                "carrera": row[5],
                "fecha": row[6].strftime('%Y-%m-%d')
            }
            for row in registros
        ]

        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        print(f"Error al obtener asistencia: {e}")
        return jsonify({"status": "error", "message": "Error interno del servidor"}), 500


# Añadir un registro de asistencia
@asistencia_bp.route("/api/asistencia", methods=["POST"])
def agregar_asistencia():
    try:
        data = request.json
        usuario_id = data.get("usuario_id")
        estado = data.get("estado")
        fecha = data.get("fecha")

        if not all([usuario_id, estado, fecha]):
            return jsonify({"status": "error", "message": "Todos los campos son obligatorios"}), 400

        cursor = mysql.connection.cursor()
        query = """
            INSERT INTO asistencia (usuario_id, estado, timestamp)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (usuario_id, estado, fecha))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"status": "success", "message": "Asistencia registrada con éxito"}), 201
    except Exception as e:
        print(f"Error al agregar asistencia: {e}")
        return jsonify({"status": "error", "message": "Error interno del servidor"}), 500


# Actualizar un registro de asistencia
@asistencia_bp.route("/api/asistencia/<int:asistencia_id>", methods=["PUT"])
def actualizar_asistencia(asistencia_id):
    try:
        data = request.json
        estado = data.get("estado")

        if not estado:
            return jsonify({"status": "error", "message": "El estado es obligatorio"}), 400

        cursor = mysql.connection.cursor()
        query = "UPDATE asistencia SET estado = %s WHERE id = %s"
        cursor.execute(query, (estado, asistencia_id))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"status": "success", "message": "Asistencia actualizada con éxito"}), 200
    except Exception as e:
        print(f"Error al actualizar asistencia: {e}")
        return jsonify({"status": "error", "message": "Error interno del servidor"}), 500


# Eliminar un registro de asistencia
@asistencia_bp.route("/api/asistencia/<int:asistencia_id>", methods=["DELETE"])
def eliminar_asistencia(asistencia_id):
    try:
        cursor = mysql.connection.cursor()
        query = "DELETE FROM asistencia WHERE id = %s"
        cursor.execute(query, (asistencia_id,))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"status": "success", "message": "Asistencia eliminada con éxito"}), 200
    except Exception as e:
        print(f"Error al eliminar asistencia: {e}")
        return jsonify({"status": "error", "message": "Error interno del servidor"}), 500


# Obtener los detalles de un registro de asistencia específico
@asistencia_bp.route("/api/asistencia/<int:asistencia_id>", methods=["GET"])
def obtener_detalle_asistencia(asistencia_id):
    try:
        cursor = mysql.connection.cursor()
        query = """
            SELECT
                estudiantes.id AS id,
                estudiantes.nombre AS nombre,
                estudiantes.codigo_saga AS saga,
                estudiantes.paralelo_id AS paralelo,
                asistencia.estado AS estado,
                carreras.nombre AS carrera,
                asistencia.timestamp AS fecha
            FROM asistencia
            INNER JOIN estudiantes ON asistencia.usuario_id = estudiantes.id
            INNER JOIN carreras ON estudiantes.carrera_id = carreras.id
            WHERE asistencia.id = %s
        """
        cursor.execute(query, (asistencia_id,))
        row = cursor.fetchone()
        cursor.close()

        if not row:
            return jsonify({"status": "error", "message": "Registro no encontrado"}), 404

        data = {
            "id": row[0],
            "nombre": row[1],
            "saga": row[2],
            "paralelo": row[3],
            "estado": row[4],
            "carrera": row[5],
            "fecha": row[6].strftime('%Y-%m-%d')
        }

        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        print(f"Error al obtener detalle de asistencia: {e}")
        return jsonify({"status": "error", "message": "Error interno del servidor"}), 500
