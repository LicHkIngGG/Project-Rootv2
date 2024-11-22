from flask import Blueprint, jsonify, request
import os
import numpy as np
from sklearn.svm import SVC
import joblib
from collections import Counter
from routes.embeddings import generar_embeddings  # Importa la función para generar embeddings

EMBEDDINGS_PATH = "C:/Users/Frostmourne/Desktop/causa/Embeddings"
MODELS_PATH = 'C:/Users/Frostmourne/Desktop/causa/Modelos'

entrenamiento_bp = Blueprint("entrenamiento_bp", __name__)

def cargar_datos(embeddings_path):
    embeddings = []
    labels = []
    label_map = {}

    if not os.path.exists(embeddings_path) or not os.listdir(embeddings_path):
        print(f"No se encontraron embeddings en {embeddings_path}.")
        return None, None, None

    for idx, file_name in enumerate(os.listdir(embeddings_path)):
        if file_name.endswith(".npy"):
            usuario_id = file_name.split(".")[0]
            label_map[idx] = usuario_id

            try:
                user_embeddings = np.load(os.path.join(embeddings_path, file_name))
                if len(user_embeddings) == 0:
                    print(f"Advertencia: No hay embeddings en {file_name}")
                    continue

                embeddings.extend(user_embeddings)
                labels.extend([idx] * len(user_embeddings))
            except Exception as e:
                print(f"Error al cargar {file_name}: {e}")

    if len(set(labels)) < 2:
        print("Error: Se requieren al menos 2 clases para entrenar el modelo.")
        return None, None, None

    embeddings = np.array(embeddings) if embeddings else None
    labels = np.array(labels) if labels else None

    return embeddings, labels, label_map


def entrenar_svm(embeddings, labels):
    model = SVC(kernel="linear", probability=True)
    model.fit(embeddings, labels)
    return model

def guardar_modelo(model, label_map):
    modelo_path = os.path.join(MODELS_PATH, "modelo_svm.pkl")
    joblib.dump(model, modelo_path)

    label_map_path = os.path.join(MODELS_PATH, "label_map.pkl")
    joblib.dump(label_map, label_map_path)

@entrenamiento_bp.route("/", methods=["POST"])
def entrenar_modelo_api():
    # Generar embeddings antes de entrenar el modelo
    print("Generando embeddings antes del entrenamiento...")
    generar_embeddings()

    embeddings, labels, label_map = cargar_datos(EMBEDDINGS_PATH)
    
    if embeddings is None or labels is None or label_map is None:
        return jsonify({"message": "No hay datos para entrenar el modelo. Genera registros primero."}), 400

    try:
        model = entrenar_svm(embeddings, labels)
        guardar_modelo(model, label_map)
        return jsonify({"message": "Entrenamiento completado con éxito."}), 200
    except Exception as e:
        return jsonify({"message": "Error durante el entrenamiento.", "error": str(e)}), 500
