import os
import numpy as np
from keras_facenet import FaceNet
import cv2

# Rutas de las imágenes y embeddings
IMAGES_PATH = "C:/Users/jrjos/OneDrive/Escritorio/Reconocimiento Facial/Data"
EMBEDDINGS_PATH = "C:/Users/jrjos/OneDrive/Escritorio/Reconocimiento Facial/Embeddings"

# Inicializa el modelo FaceNet
embedder = FaceNet()

def generar_embeddings():
    usuarios_sin_imagenes = []
    os.makedirs(EMBEDDINGS_PATH, exist_ok=True)

    for codigo_usuario in os.listdir(IMAGES_PATH):
        usuario_path = os.path.join(IMAGES_PATH, codigo_usuario)
        embeddings = []

        if not os.path.isdir(usuario_path):
            continue

        print(f"Procesando usuario: {codigo_usuario}")
        tiene_imagenes_validas = False

        for img_file in os.listdir(usuario_path):
            img_path = os.path.join(usuario_path, img_file)
            img = cv2.imread(img_path)

            if img is None:
                print(f"Error al cargar imagen: {img_path}")
                continue

            img = cv2.resize(img, (160, 160))
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = img.astype("float32") / 255.0
            img = np.expand_dims(img, axis=0)

            try:
                embedding = embedder.embeddings(img)[0]
                embeddings.append(embedding)
                tiene_imagenes_validas = True
            except Exception as e:
                print(f"Error al generar embedding para {img_path}: {e}")

        if tiene_imagenes_validas:
            embeddings_path = os.path.join(EMBEDDINGS_PATH, f"{codigo_usuario}.npy")
            np.save(embeddings_path, embeddings)
            print(f"Embeddings guardados para el usuario: {codigo_usuario}")
        else:
            print(f"No se encontraron imágenes válidas para el usuario: {codigo_usuario}")
            usuarios_sin_imagenes.append(codigo_usuario)

    if usuarios_sin_imagenes:
        print("Usuarios sin imágenes válidas:")
        for usuario in usuarios_sin_imagenes:
            print(f"- {usuario}")
