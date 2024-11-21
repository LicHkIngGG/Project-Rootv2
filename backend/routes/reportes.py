from flask import Blueprint, request, jsonify
from extensions import mysql

# Crear el blueprint
reportes_bp = Blueprint('reportes', __name__)

# Endpoint para obtener estadísticas de asistencia
@reportes_bp.route('/api/reportes/asistencia', methods=['GET'])
def obtener_estadisticas_asistencia():
    try:
        # Obtener filtros de los parámetros
        filtro = request.args.get('filtro', 'mes')
        carrera = request.args.get('carrera', None)
        paralelo = request.args.get('paralelo', None)

        query = """
            SELECT
                SUM(CASE WHEN estado = 'Presente' THEN 1 ELSE 0 END) AS asiste,
                SUM(CASE WHEN estado = 'Ausente' THEN 1 ELSE 0 END) AS no_asiste
            FROM asistencia
            WHERE 1=1
        """

        # Aplicar filtros
        if filtro == 'dia':
            query += " AND DATE(fecha) = CURDATE()"
        elif filtro == 'semana':
            query += " AND YEARWEEK(fecha, 1) = YEARWEEK(CURDATE(), 1)"
        elif filtro == 'mes':
            query += " AND MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())"
        else:
            return jsonify({"status": "error", "message": "Filtro no válido"}), 400

        if carrera:
            query += " AND carrera = %s"
        if paralelo:
            query += " AND paralelo = %s"

        cursor = mysql.connection.cursor()
        filters = []
        if carrera:
            filters.append(carrera)
        if paralelo:
            filters.append(paralelo)

        cursor.execute(query, tuple(filters))
        result = cursor.fetchone()
        cursor.close()

        data = [
            {"name": "Asiste", "value": result[0]},
            {"name": "No asiste", "value": result[1]}
        ]
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        print(f"Error al obtener estadísticas de asistencia: {e}")
        return jsonify({"status": "error", "message": "Error al obtener estadísticas"}), 500


# Endpoint para obtener estadísticas de aperturas de la chapa
@reportes_bp.route('/api/reportes/apertura', methods=['GET'])
def obtener_estadisticas_apertura():
    try:
        query = """
            SELECT
                CONCAT('Semana ', WEEK(timestamp)) AS semana,
                COUNT(*) AS aperturas
            FROM logs_chapa
            WHERE accion = 'LAB ABIERTO'
            GROUP BY WEEK(timestamp)
            ORDER BY WEEK(timestamp);
        """

        cursor = mysql.connection.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()

        data = [{"name": row[0], "Aperturas": row[1]} for row in result]
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        print(f"Error al obtener estadísticas de apertura: {e}")
        return jsonify({"status": "error", "message": "Error al obtener estadísticas de apertura"}), 500
