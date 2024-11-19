from flask import Blueprint, request, jsonify
import cv2
import os
import numpy as np
import base64
from datetime import datetime


registro_bp = Blueprint('registro_bp', __name__)

# Ruta donde se almacenarán las imágenes de los usuarios
DATA_PATH = 'C:/Users/jrjos/OneDrive/Escritorio/Reconocimiento Facial/Data'

@registro_bp.route('/api/registro/register', methods=['POST'])
def register_user():
    """
    Endpoint para registrar un usuario y capturar imágenes faciales
    de diferentes ángulos (frontal, perfil izquierdo, perfil derecho).
    """
    data = request.get_json()

    # Validar datos recibidos
    try:
        name = data['name']
        code = data['code']
        email = data['email']
        semester = data['semester']
        career = data['career']
        image = data['image']
    except KeyError as e:
        return jsonify({'message': 'Faltan datos en la solicitud.', 'error': str(e)}), 400

    # Crear carpeta para el usuario si no existe
    person_path = os.path.join(DATA_PATH, name)
    if not os.path.exists(person_path):
        os.makedirs(person_path)

    # Decodificar la imagen base64
    try:
        image_data = base64.b64decode(image.split(",")[1])
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        return jsonify({'message': 'Error al decodificar la imagen.', 'error': str(e)}), 400

    # Inicializar clasificadores para detección de rostros
    face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    profile_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)
    profile_left = profile_classifier.detectMultiScale(gray, 1.3, 5)
    profile_right = profile_classifier.detectMultiScale(cv2.flip(gray, 1), 1.3, 5)

    count = 0

    # Capturar rostros frontales
    for (x, y, w, h) in faces:
        rostro = frame[y:y + h, x:x + w]
        rostro = resize_image(rostro)
        save_image(person_path, rostro, f'frontal_{count}')
        count += 1

    # Capturar perfiles izquierdos
    for (x, y, w, h) in profile_left:
        rostro = frame[y:y + h, x:x + w]
        rostro = resize_image(rostro)
        save_image(person_path, rostro, f'profile_left_{count}')
        count += 1

    # Capturar perfiles derechos (ajustar coordenadas por espejo)
    for (x, y, w, h) in profile_right:
        x = frame.shape[1] - x - w  # Ajustar coordenadas del rostro reflejado
        rostro = frame[y:y + h, x:x + w]
        rostro = resize_image(rostro)
        save_image(person_path, rostro, f'profile_right_{count}')
        count += 1

    if count > 0:
        return jsonify({'message': f'Registro exitoso. {count} imágenes capturadas y guardadas.'})
    else:
        return jsonify({'message': 'No se detectaron rostros.', 'error': 'No faces detected'}), 400


def resize_image(image, size=(150, 150)):
    """
    Redimensionar la imagen al tamaño especificado.
    :param image: Imagen original.
    :param size: Tamaño de salida en (ancho, alto).
    :return: Imagen redimensionada.
    """
    return cv2.resize(image, size, interpolation=cv2.INTER_CUBIC)


def save_image(path, image, filename):
    """
    Guardar la imagen en una ruta específica.
    :param path: Ruta donde se guardará la imagen.
    :param image: Imagen a guardar.
    :param filename: Nombre del archivo sin extensión.
    """
    file_path = os.path.join(path, f'{filename}.jpg')
    cv2.imwrite(file_path, image)
