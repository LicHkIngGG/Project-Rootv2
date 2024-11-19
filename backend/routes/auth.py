from flask import Blueprint, request, jsonify
from extensions import mysql
import hashlib

auth_bp = Blueprint('auth', __name__)

# Endpoint para el login
@auth_bp.route('/api/login', methods=['POST'])
def login():
    try:
        # Obtiene los datos enviados desde el frontend
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"status": "error", "message": "Faltan credenciales"}), 400

        # Hash de la contraseña para comparación
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Realiza la consulta a la base de datos
        cursor = mysql.connection.cursor()
        query = """
            SELECT id, nombre, email, rol 
            FROM usuarios
            WHERE email = %s AND password = %s AND estado = 'activo';
        """
        cursor.execute(query, (username, hashed_password))
        user = cursor.fetchone()
        cursor.close()

        # Si encuentra un usuario válido
        if user:
            return jsonify({
                "status": "success",
                "user": {
                    "id": user[0],
                    "nombre": user[1],
                    "email": user[2],
                    "rol": user[3]
                }
            }), 200
        else:
            return jsonify({"status": "error", "message": "Credenciales incorrectas"}), 401

    except Exception as e:
        print(f"Error en el login: {e}")
        return jsonify({"status": "error", "message": "Error interno del servidor"}), 500
