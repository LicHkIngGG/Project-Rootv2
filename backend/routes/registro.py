import os
import base64
from flask import Blueprint, request, jsonify
from extensions import mysql

registro_bp = Blueprint("registro_bp", __name__)

DATA_PATH = "C:/Users/Frostmourne/Desktop/causa/Data"

@registro_bp.route("/register", methods=["POST"])
def registrar_estudiante():
    data = request.get_json()

    try:
        # Extraer datos del JSON recibido
        nombre = data.get("nombre")
        codigo_saga = data.get("codigo_saga")
        paralelo_id = data.get("paralelo_id")
        carrera_id = data.get("carrera_id")
        imagenes = data.get("imagenes", [])

        # Validación de datos obligatorios
        if not all([nombre, codigo_saga, paralelo_id, carrera_id, imagenes]):
            return jsonify({"message": "Faltan datos obligatorios"}), 400

        if len(imagenes) < 10:
            return jsonify({"message": "Se requieren al menos 10 imágenes"}), 400

        # Validar que paralelo_id y carrera_id existan
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id FROM paralelos WHERE id = %s", (paralelo_id,))
        if not cursor.fetchone():
            return jsonify({"message": "El paralelo_id no es válido"}), 400

        cursor.execute("SELECT id FROM carreras WHERE id = %s", (carrera_id,))
        if not cursor.fetchone():
            return jsonify({"message": "El carrera_id no es válido"}), 400

        # Verificar si el código_saga ya está registrado
        cursor.execute("SELECT id FROM estudiantes WHERE codigo_saga = %s", (codigo_saga,))
        if cursor.fetchone():
            return jsonify({"message": "El código_saga ya está registrado"}), 400

        # Insertar estudiante en la tabla "estudiantes"
        query = """
            INSERT INTO estudiantes (nombre, codigo_saga, paralelo_id, carrera_id, estado, fecha_registro)
            VALUES (%s, %s, %s, %s, 'activo', NOW())
        """
        cursor.execute(query, (nombre, codigo_saga, paralelo_id, carrera_id))
        mysql.connection.commit()
        estudiante_id = cursor.lastrowid

        # Crear carpeta para almacenar imágenes
        estudiante_path = os.path.join(DATA_PATH, codigo_saga)
        os.makedirs(estudiante_path, exist_ok=True)

        # Guardar imágenes en el sistema y registrar en la tabla "imagenes"
        for idx, img_base64 in enumerate(imagenes):
            if not img_base64:
                continue
            try:
                # Decodificar la imagen base64
                image_data = base64.b64decode(img_base64.split(",")[1])
                file_path = os.path.join(estudiante_path, f"rostro_{idx + 1}.jpg")
                with open(file_path, "wb") as f:
                    f.write(image_data)

                # Registrar la imagen en la base de datos
                img_query = "INSERT INTO imagenes (estudiante_id, ruta_imagen) VALUES (%s, %s)"
                cursor.execute(img_query, (estudiante_id, file_path))
            except Exception as img_error:
                print(f"Error al guardar la imagen {idx + 1}: {img_error}")
                return jsonify({"message": "Error al procesar las imágenes"}), 500

        mysql.connection.commit()
        return jsonify({"message": "Estudiante y sus imágenes registrados correctamente"}), 201

    except Exception as e:
        print(f"Error general: {e}")
        return jsonify({"message": "Error al registrar estudiante", "error": str(e)}), 500
