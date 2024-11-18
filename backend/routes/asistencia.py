# routes/asistencia.py
from flask import Blueprint, request, jsonify
from extensions import mysql

asistencia_bp = Blueprint('asistencia', __name__)

@asistencia_bp.route('/api/asistencia', methods=['POST'])
def registrar_asistencia():
    data = request.json
    nombre = data.get('nombre')
    if nombre:
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO asistencia (nombre) VALUES (%s)", (nombre,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"status": "success", "message": "Asistencia registrada", "nombre": nombre}), 201
    else:
        return jsonify({"status": "error", "message": "Nombre es requerido"}), 400