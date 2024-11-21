import os
import base64
from flask import Blueprint, request, jsonify
from extensions import mysql

registro_bp = Blueprint("registro_bp", __name__)

# Ruta para almacenar imágenes capturadas y datos de usuario
DATA_PATH = "C:/Users/jrjos/OneDrive/Escritorio/Reconocimiento Facial/Data"

@registro_bp.route("/register", methods=["POST"])
def registrar_usuario():
    data = request.get_json()

    try:
        # Validar los datos recibidos
        nombre = data.get("nombre")
        codigo = data.get("codigo")
        email = data.get("email")
        semestre = data.get("semestre")
        carrera = data.get("carrera")
        imagenes = data.get("imagenes", [])  # Lista de imágenes en formato base64

        if not all([nombre, codigo, email, semestre, carrera, imagenes]):
            return jsonify({"message": "Faltan datos obligatorios"}), 400

        if len(imagenes) < 10:
            return jsonify({"message": "Se requieren al menos 10 imágenes"}), 400

        # Verificar si el código ya existe en la base de datos
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id FROM usuarios WHERE codigo = %s", (codigo,))
        if cursor.fetchone():
            return jsonify({"message": "El código ya está registrado"}), 400

        # Insertar datos personales en la base de datos
        query = """
            INSERT INTO usuarios (nombre, codigo, email, semestre, carrera)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (nombre, codigo, email, semestre, carrera))
        mysql.connection.commit()
        usuario_id = cursor.lastrowid

        # Crear carpeta para almacenar imágenes
        usuario_path = os.path.join(DATA_PATH, codigo)
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

                # Registrar imagen en la base de datos
                img_query = "INSERT INTO imagenes (usuario_id, ruta_imagen) VALUES (%s, %s)"
                cursor.execute(img_query, (usuario_id, file_path))
            except Exception as img_error:
                print(f"Error al guardar la imagen {idx + 1}: {img_error}")
                return jsonify({"message": "Error al procesar las imágenes"}), 500

        mysql.connection.commit()
        return jsonify({"message": "Usuario y imágenes registrados correctamente"}), 201
    except Exception as e:
        print(f"Error general: {e}")
        return jsonify({"message": "Error al registrar usuario", "error": str(e)}), 500
