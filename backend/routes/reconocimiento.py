from flask import Blueprint, request, jsonify
from deepface import DeepFace
import cv2
import numpy as np
import base64

# Definir el blueprint como "reconocimiento_bp"
reconocimiento_bp = Blueprint('reconocimiento_bp', __name__)

@reconocimiento_bp.route('/api/recognize', methods=['POST'])
def recognize_face():
    data = request.get_json()
    image_data = base64.b64decode(data['image'].split(",")[1])
    nparr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    try:
        result = DeepFace.find(img_path=frame, db_path="C:/Users/jrjos/OneDrive/Escritorio/Reconocimiento Facial/Data")
        if not result.empty:
            return jsonify({'message': f"Identificado: {result.iloc[0]['identity']}"})
        else:
            return jsonify({'message': 'No identificado'})
    except Exception as e:
        return jsonify({'message': 'Error en reconocimiento', 'error': str(e)})
