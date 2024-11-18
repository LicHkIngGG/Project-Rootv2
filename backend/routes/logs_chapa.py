from flask import Blueprint, request, jsonify
from extensions import mysql
import socket
import time

logs_chapa_bp = Blueprint('logs_chapa', __name__)

# Dirección IP y puerto del Arduino
ARDUINO_IP = "192.168.1.110"
ARDUINO_PORT = 80

# Función para manejar la conexión con el Arduino
def manejar_arduino(comando):
    try:
        print(f"Intentando conectar con {ARDUINO_IP}:{ARDUINO_PORT}")
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(5)  # Establece un tiempo de espera (5 segundos)
            sock.connect((ARDUINO_IP, ARDUINO_PORT))
            print(f"Conexión establecida con {ARDUINO_IP}:{ARDUINO_PORT}")
            sock.sendall(comando.encode() + b"\n")
            print(f"Comando enviado: {comando}")

            respuesta = b""
            while True:
                data = sock.recv(1024)
                if not data:
                    break
                respuesta += data

            respuesta_decodificada = respuesta.decode().strip()  # Decodifica y limpia la respuesta
            print(f"Respuesta completa del Arduino: {respuesta_decodificada}")

            # Procesa las líneas de la respuesta y filtra las útiles
            lineas = respuesta_decodificada.split("\n")
            respuestas_utiles = [linea.strip() for linea in lineas if "LAB" in linea]
            print(f"Respuestas útiles del Arduino: {respuestas_utiles}")

            return respuestas_utiles
    except socket.timeout:
        print("Error: Tiempo de espera agotado al conectar con el Arduino")
        return ["Error: Timeout"]
    except Exception as e:
        print(f"Error al conectar con el Arduino: {e}")
        return [f"Error: {e}"]

# Función para registrar el estado en la base de datos
def manejar_base_datos(mensajes):
    for mensaje in mensajes:
        try:
            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO logs_chapa (accion) VALUES (%s)", (mensaje,))
            mysql.connection.commit()
            cursor.close()
            print(f"Log registrado: {mensaje}")
        except Exception as e:
            print(f"Error al registrar log en la base de datos para {mensaje}: {e}")

# Endpoint para activar la chapa
@logs_chapa_bp.route('/api/activar_chapa', methods=['POST'])
def activar_chapa():
    accion = request.json.get('accion')
    if accion == 'abrir':
        # Maneja la comunicación con el Arduino
        respuestas = manejar_arduino("abrir")
        errores = [r for r in respuestas if "Error" in r]

        # Si hay errores, devuelve el primero encontrado
        if errores:
            return jsonify({"status": "error", "message": errores[0]}), 500

        # Verificar si hay respuestas útiles
        if not respuestas:
            print("No se recibieron respuestas útiles del Arduino.")
            return jsonify({"status": "error", "message": "Sin respuestas válidas del Arduino"}), 500

        # Filtrar respuestas válidas
        respuestas_validas = [respuesta for respuesta in respuestas if respuesta in ["LAB ABIERTO", "LAB CERRADO"]]
        respuestas_no_validas = [respuesta for respuesta in respuestas if respuesta not in respuestas_validas]

        # Registrar respuestas válidas en la base de datos
        if respuestas_validas:
            manejar_base_datos(respuestas_validas)

        # Registrar respuestas no válidas en consola para diagnóstico
        for respuesta in respuestas_no_validas:
            print(f"Respuesta inesperada del Arduino: {respuesta}")

        # Devuelve las respuestas útiles al frontend
        return jsonify({"status": "success", "acciones": respuestas_validas}), 200
    else:
        return jsonify({"status": "error", "message": "Acción no válida"}), 400
