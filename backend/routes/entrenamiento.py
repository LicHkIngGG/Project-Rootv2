#router/entrenamiento
from flask import Blueprint, jsonify
import subprocess


entrenamiento_bp = Blueprint('entrenamiento_bp', __name__)

@entrenamiento_bp.route('/api/train', methods=['POST'])
def train_model():
    try:
        # Ejecutar el script de entrenamiento
        subprocess.run(['python', 'entrenandoRF.py'], check=True)
        return jsonify({'message': 'Modelo entrenado con éxito.'})
    except subprocess.CalledProcessError as e:
        return jsonify({'message': 'Error al entrenar el modelo.'}), 500