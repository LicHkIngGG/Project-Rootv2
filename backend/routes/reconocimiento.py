from flask import Blueprint, request, jsonify
from deepface import DeepFace
import cv2
import numpy as np
import base64

# Definir el blueprint como "reconocimiento_bp"
reconocimiento_bp = Blueprint('reconocimiento_bp', __name__)

MODELS_PATH = "C:/Users/jrjos/OneDrive/Escritorio/Reconocimiento Facial/Modelos"

embedder = FaceNet()


# Cargar el modelo SVM y el mapeo de etiquetas
try:
    svm_model = joblib.load(os.path.join(MODELS_PATH, "modelo_svm.pkl"))
    label_map = joblib.load(os.path.join(MODELS_PATH, "label_map.pkl"))
    print("Modelo y etiquetas cargados correctamente.")
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

        # Verifica si la imagen está en el payload
        if "imagen" not in data or not data["imagen"]:
            return jsonify({"message": "Falta la imagen para el reconocimiento."}), 400

        # Elimina el prefijo Base64 si está presente
        try:
            imagen_base64 = data["imagen"].split(",")[1]
            print(f"Imagen Base64 recibida (primeros 100 caracteres): {imagen_base64[:100]}")
        except Exception as e:
            print(f"Error al procesar el prefijo de la imagen: {e}")
            return jsonify({"message": "Formato de imagen inválido."}), 400

        # Decodifica la imagen
        try:
            image_data = base64.b64decode(imagen_base64)
            np_image = np.frombuffer(image_data, dtype=np.uint8)
            print(f"Tamaño del buffer decodificado: {np_image.shape}")
            frame = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
            if frame is None:
                print("Error: OpenCV no pudo decodificar la imagen.")
                return jsonify({"message": "La imagen no pudo ser decodificada."}), 400
        except Exception as e:
            print(f"Error al decodificar la imagen: {e}")
            return jsonify({"message": "Error al decodificar la imagen."}), 400

        # Preprocesar la imagen
        frame = cv2.resize(frame, (160, 160))
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = frame.astype("float32") / 255.0
        frame = np.expand_dims(frame, axis=0)

        # Generar el embedding
        try:
            embedding = embedder.embeddings(frame)[0]
            print(f"Embedding generado, tamaño: {embedding.shape}")
        except Exception as e:
            print(f"Error al generar el embedding: {e}")
            return jsonify({"message": "Error al generar el embedding."}), 500

        # Realizar el reconocimiento
        try:
            pred_proba = svm_model.predict_proba([embedding])[0]
            pred_label = np.argmax(pred_proba)
            confidence = pred_proba[pred_label]
            print(f"Predicciones: {pred_proba}, Etiqueta: {pred_label}, Confianza: {confidence}")
        except Exception as e:
            print(f"Error al realizar la predicción: {e}")
            return jsonify({"message": "Error al realizar la predicción."}), 500

        # Validar confianza
        if confidence > 0.4:  # Ajusta el umbral si es necesario
            usuario = label_map[pred_label]
            return jsonify({"usuario": usuario, "confianza": confidence}), 200
        else:
            return jsonify({'message': 'No identificado'})
    except Exception as e:
        return jsonify({'message': 'Error en reconocimiento', 'error': str(e)})
