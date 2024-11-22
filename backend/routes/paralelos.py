from flask import Blueprint, request, jsonify
from extensions import mysql

# Crear el blueprint para paralelos
paralelos_bp = Blueprint("paralelos_bp", __name__)

# Obtener todos los paralelos ordenados correctamente
@paralelos_bp.route("/api/paralelos", methods=["GET"])
def obtener_paralelos():
    """
    Devuelve la lista de paralelos ordenados numéricamente (1er, 2do, ..., 10mo).
    """
    try:
        cursor = mysql.connection.cursor()
        query = """
            SELECT id, nombre
            FROM paralelos
            ORDER BY 
              CAST(SUBSTRING_INDEX(nombre, ' ', 1) AS UNSIGNED),
              nombre;
        """
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()

        paralelos = [{"id": row[0], "nombre": row[1]} for row in result]
        return jsonify({"status": "success", "data": paralelos}), 200
    except Exception as e:
        print(f"Error al obtener paralelos: {e}")
        return jsonify({"status": "error", "message": "Error al obtener paralelos"}), 500


# Eliminar un paralelo (opcional, por si se necesita en el futuro)
@paralelos_bp.route("/api/paralelos/<int:paralelo_id>", methods=["DELETE"])
def eliminar_paralelo(paralelo_id):
    """
    Permite eliminar un paralelo por su ID (opcional).
    """
    try:
        cursor = mysql.connection.cursor()
        query = "DELETE FROM paralelos WHERE id = %s"
        cursor.execute(query, (paralelo_id,))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"status": "success", "message": "Paralelo eliminado con éxito"}), 200
    except Exception as e:
        print(f"Error al eliminar paralelo: {e}")
        return jsonify({"status": "error", "message": "Error al eliminar paralelo"}), 500


# Consultar un paralelo específico (opcional, si es necesario en el futuro)
@paralelos_bp.route("/api/paralelos/<int:paralelo_id>", methods=["GET"])
def obtener_paralelo_por_id(paralelo_id):
    """
    Obtiene un paralelo específico por su ID.
    """
    try:
        cursor = mysql.connection.cursor()
        query = "SELECT id, nombre FROM paralelos WHERE id = %s"
        cursor.execute(query, (paralelo_id,))
        row = cursor.fetchone()
        cursor.close()

        if not row:
            return jsonify({"status": "error", "message": "Paralelo no encontrado"}), 404

        paralelo = {"id": row[0], "nombre": row[1]}
        return jsonify({"status": "success", "data": paralelo}), 200
    except Exception as e:
        print(f"Error al obtener paralelo: {e}")
        return jsonify({"status": "error", "message": "Error al obtener paralelo"}), 500


# Migración inicial: Insertar paralelos (puede ser ejecutado como una función o script separado)
def insertar_paralelos_iniciales():
    """
    Inserta los paralelos iniciales en la tabla paralelos si aún no existen.
    """
    try:
        cursor = mysql.connection.cursor()

        # Lista de paralelos iniciales
        paralelos = [
            "1er semestre",
            "2do semestre",
            "3er semestre",
            "4to semestre",
            "5to semestre",
            "6to semestre",
            "7mo semestre",
            "8vo semestre",
            "9no semestre",
            "10mo semestre",
        ]

        # Verificar si ya hay registros en la tabla
        cursor.execute("SELECT COUNT(*) FROM paralelos")
        count = cursor.fetchone()[0]

        if count == 0:  # Solo insertar si la tabla está vacía
            query = "INSERT INTO paralelos (nombre) VALUES (%s)"
            for paralelo in paralelos:
                cursor.execute(query, (paralelo,))
            mysql.connection.commit()
            print("Paralelos iniciales insertados con éxito.")
        else:
            print("La tabla de paralelos ya contiene datos. No se realizaron cambios.")

        cursor.close()
    except Exception as e:
        print(f"Error al insertar paralelos iniciales: {e}")
