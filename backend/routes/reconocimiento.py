import os
import cv2
import numpy as np
import base64
from flask import Blueprint, request, jsonify
from sklearn.svm import SVC
import joblib
from keras_facenet import FaceNet

reconocimiento_bp = Blueprint("reconocimiento_bp", __name__)

MODELS_PATH = "C:/Users/Frostmourne/Desktop/causa/Modelos"
embedder = FaceNet()

# Cargar el modelo SVM y el mapeo de etiquetas
try:
    svm_model = joblib.load(os.path.join(MODELS_PATH, "modelo_svm.pkl"))
    label_map = joblib.load(os.path.join(MODELS_PATH, "label_map.pkl"))
except Exception as e:
    print(f"Error al cargar el modelo o el mapeo de etiquetas: {e}")
    svm_model = None
    label_map = None

@reconocimiento_bp.route("/", methods=["POST"])
def reconocer_usuario():
    if not svm_model or not label_map:
        return jsonify({"message": "Modelo o etiquetas no cargadas correctamente."}), 500

    try:
        data = request.get_json()
        if "imagen" not in data:
            return jsonify({"message": "Falta la imagen para el reconocimiento"}), 400

        imagen_base64 = data["imagen"].split(",")[1]
        image_data = base64.b64decode(imagen_base64)
        np_image = np.frombuffer(image_data, dtype=np.uint8)
        frame = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

        # Preprocesar la imagen
        frame = cv2.resize(frame, (160, 160))
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = frame.astype("float32") / 255.0
        frame = np.expand_dims(frame, axis=0)

        # Generar el embedding
        embedding = embedder.embeddings(frame)[0]

        # Realizar el reconocimiento usando SVM
        pred_proba = svm_model.predict_proba([embedding])[0]
        pred_label = np.argmax(pred_proba)
        confidence = pred_proba[pred_label]

        # Verificar si el usuario es reconocido
        if confidence > 0.4:  # Umbral de confianza (ajustar según los resultados)
            usuario = label_map[pred_label]
            return jsonify({"usuario": usuario, "confianza": confidence}), 200
        else:
            return jsonify({"usuario": "Desconocido", "confianza": confidence}), 200

    except Exception as e:
        print(f"Error durante el reconocimiento: {e}")
        return jsonify({"message": "Error durante el reconocimiento.", "error": str(e)}), 500
