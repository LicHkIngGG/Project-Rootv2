import os
import base64
from flask import Blueprint, request, jsonify
from extensions import mysql

registro_bp = Blueprint("registro_bp", __name__)

# Ruta para almacenar imágenes capturadas y datos de usuario
DATA_PATH = "C:/Users/Frostmourne/Desktop/causa/data"

@registro_bp.route("/register", methods=["POST"])
def registrar_usuario():
    data = request.get_json()

    try:
        # Validar los datos recibidos
        nombre = data.get("nombre")
        codigo_saga = data.get("codigo_saga")
        paralelo_id = data.get("paralelo_id")
        carrera_id = data.get("carrera_id")
        estado = data.get("estado", "activo")  # Por defecto "activo"
        imagenes = data.get("imagenes", [])  # Lista de imágenes en formato base64

        if not all([nombre, codigo_saga, paralelo_id, carrera_id, imagenes]):
            return jsonify({"message": "Faltan datos obligatorios"}), 400

        if len(imagenes) < 10:
            return jsonify({"message": "Se requieren al menos 10 imágenes"}), 400

        # Verificar si el código_saga ya existe en la base de datos
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id FROM estudiantes WHERE codigo_saga = %s", (codigo_saga,))
        if cursor.fetchone():
            return jsonify({"message": "El código ya está registrado"}), 400

        # Insertar datos personales en la tabla "estudiantes"
        query = """
            INSERT INTO estudiantes (nombre, codigo_saga, paralelo_id, carrera_id, estado, fecha_registro)
            VALUES (%s, %s, %s, %s, %s, NOW())
        """
        cursor.execute(query, (nombre, codigo_saga, paralelo_id, carrera_id, estado))
        mysql.connection.commit()
        estudiante_id = cursor.lastrowid

        # Crear carpeta para almacenar imágenes
        usuario_path = os.path.join(DATA_PATH, codigo_saga)
        os.makedirs(usuario_path, exist_ok=True)

        # Decodificar y guardar cada imagen
        for idx, img_base64 in enumerate(imagenes):
            if not img_base64:
                print(f"Imagen {idx} está vacía. Saltando...")
                continue
            try:
                # Decodificar la imagen base64
                image_data = base64.b64decode(img_base64.split(",")[1])
                file_path = os.path.join(usuario_path, f"rostro_{idx + 1}.jpg")
                with open(file_path, "wb") as f:
                    f.write(image_data)

                # Registrar imagen en la tabla "imagenes"
                img_query = "INSERT INTO imagenes (estudiante_id, ruta_imagen) VALUES (%s, %s)"
                cursor.execute(img_query, (estudiante_id, file_path))
            except Exception as img_error:
                print(f"Error al guardar la imagen {idx + 1}: {img_error}")
                return jsonify({"message": "Error al procesar las imágenes"}), 500

        mysql.connection.commit()
        return jsonify({"message": "Usuario y imágenes registrados correctamente"}), 201
    except Exception as e:
        print(f"Error general: {e}")
        return jsonify({"message": "Error al registrar usuario", "error": str(e)}), 500
