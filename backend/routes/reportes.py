from flask import Blueprint, request, jsonify
from extensions import mysql

# Crear el blueprint
reportes_bp = Blueprint('reportes', __name__)

# Endpoint para obtener las estadísticas de asistencia
@reportes_bp.route('/api/reportes/asistencia', methods=['GET'])
def obtener_estadisticas_asistencia():
    try:
        # Obtener el filtro de tiempo (día, semana, mes) del query param
        filtro = request.args.get('filtro', 'mes')

        query = ""
        if filtro == 'dia':
            query = """
                SELECT
                    SUM(CASE WHEN accion = 'Asiste' THEN 1 ELSE 0 END) AS asiste,
                    SUM(CASE WHEN accion = 'Llega tarde' THEN 1 ELSE 0 END) AS llega_tarde,
                    SUM(CASE WHEN accion = 'No asiste' THEN 1 ELSE 0 END) AS no_asiste
                FROM chapa_electrica_asistencia
                WHERE DATE(timestamp) = CURDATE();
            """
        elif filtro == 'semana':
            query = """
                SELECT
                    SUM(CASE WHEN accion = 'Asiste' THEN 1 ELSE 0 END) AS asiste,
                    SUM(CASE WHEN accion = 'Llega tarde' THEN 1 ELSE 0 END) AS llega_tarde,
                    SUM(CASE WHEN accion = 'No asiste' THEN 1 ELSE 0 END) AS no_asiste
                FROM chapa_electrica_asistencia
                WHERE YEARWEEK(timestamp, 1) = YEARWEEK(CURDATE(), 1);
            """
        elif filtro == 'mes':
            query = """
                SELECT
                    SUM(CASE WHEN accion = 'Asiste' THEN 1 ELSE 0 END) AS asiste,
                    SUM(CASE WHEN accion = 'Llega tarde' THEN 1 ELSE 0 END) AS llega_tarde,
                    SUM(CASE WHEN accion = 'No asiste' THEN 1 ELSE 0 END) AS no_asiste
                FROM chapa_electrica_asistencia
                WHERE MONTH(timestamp) = MONTH(CURDATE()) AND YEAR(timestamp) = YEAR(CURDATE());
            """
        else:
            return jsonify({"status": "error", "message": "Filtro no válido"}), 400

        # Ejecutar la consulta
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        result = cursor.fetchone()
        cursor.close()

        # Formatear los datos para el frontend
        data = [
            {"name": "Asiste", "value": result[0]},
            {"name": "No asiste", "value": result[2]}
        ]
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        print(f"Error al obtener estadísticas de asistencia: {e}")
        return jsonify({"status": "error", "message": "Error al obtener estadísticas"}), 500


# Endpoint para obtener las estadísticas de apertura
@reportes_bp.route('/api/reportes/apertura', methods=['GET'])
def obtener_estadisticas_apertura():
    try:
        query = """
            SELECT
                CONCAT('Semana ', WEEK(timestamp)) AS semana,
                COUNT(*) AS aperturas
            FROM chapa_electrica_logs_chapa
            WHERE accion = 'LAB ABIERTO'
            GROUP BY WEEK(timestamp)
            ORDER BY WEEK(timestamp);
        """

        # Ejecutar la consulta
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()

        # Formatear los datos para el frontend
        data = [{"name": row[0], "Aperturas": row[1]} for row in result]
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        print(f"Error al obtener estadísticas de apertura: {e}")
        return jsonify({"status": "error", "message": "Error al obtener estadísticas de apertura"}), 500
