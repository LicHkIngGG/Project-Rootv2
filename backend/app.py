from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from extensions import mysql
from routes.logs_chapa import logs_chapa_bp
from routes.asistencia import asistencia_bp
from routes.notificaciones import notificaciones_bp
from routes.registro import registro_bp
from routes.entrenamiento import entrenamiento_bp
from routes.reconocimiento import reconocimiento_bp

app = Flask(__name__)
CORS(app, origins="*")
socketio = SocketIO(app, cors_allowed_origins="*")

# Configuración de la base de datos MySQL
app.config.from_pyfile('config.py')

# Inicializar MySQL
mysql.init_app(app)

# Registrar Blueprints
app.register_blueprint(logs_chapa_bp)
app.register_blueprint(asistencia_bp)
app.register_blueprint(notificaciones_bp)
app.register_blueprint(registro_bp, url_prefix='/api/registro')  # Rutas para Registro
app.register_blueprint(entrenamiento_bp, url_prefix='/api/entrenamiento')  # Rutas para Entrenamiento
app.register_blueprint(reconocimiento_bp, url_prefix='/api/reconocimiento')  # Rutas para Reconocimiento Facial

if __name__ == '__main__':
    app.debug = True
    socketio.run(app, host='0.0.0.0', port=5000)