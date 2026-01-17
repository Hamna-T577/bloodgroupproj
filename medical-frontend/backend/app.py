# import os
# import cv2
# import numpy as np
# import tensorflow as tf
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from sqlalchemy import create_engine
# from sqlalchemy import text


# engine = create_engine(
#     "postgresql://postgres:Hamna%40123@localhost:5432/fingerprint_db"
# )


# app = Flask(__name__)
# CORS(app)

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_PATH = os.path.join(BASE_DIR, "models", "final_blood_model.h5")
# CLASS_PATH = os.path.join(BASE_DIR, "models", "classes.txt")

# # Load Brain
# model = tf.keras.models.load_model(MODEL_PATH, compile=False)
# with open(CLASS_PATH, "r") as f:
#     class_names = [line.strip() for line in f.readlines()]


# @app.route('/predict', methods=['POST'])
# def predict():
#     file = request.files['image'].read()

#     # Convert image
#     nparr = np.frombuffer(file, np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
#     img = cv2.resize(img, (128, 128)) / 255.0
#     img = img.reshape(1, 128, 128, 1)

#     # Predict
#     prediction = model.predict(img)
#     index = np.argmax(prediction)
#     predicted_label = class_names[index]

#     # 🔥 INSERT INTO DATABASE (THIS WAS MISSING)
#     with engine.begin() as conn:
#         conn.execute(
#             text("""
#                 INSERT INTO fingerprints (image, predicted_blood)
#                 VALUES (:image, :predicted_blood)
#             """),
#             {
#                 "image": file,
#                 "predicted_blood": predicted_label
#             }
#         )

#     return jsonify({"blood_group": predicted_label})
















# # @app.route('/predict', methods=['POST'])
# # def predict():
# #     print("📥 Request received")

# #     if 'image' not in request.files:
# #         return jsonify({"error": "No image"}), 400

# #     file = request.files['image'].read()
# #     print("🖼 Image read, size:", len(file))

# #     # Convert bytes to NumPy array
# #     nparr = np.frombuffer(file, np.uint8)

# #     # Try to decode BMP, PNG, JPG
# #     img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
# #     if img is None:
# #         print("❌ Failed to decode image")
# #         return jsonify({"error": "Cannot decode image"}), 400

# #     print("🧠 Image decoded")

# #     # Resize & normalize
# #     img = cv2.resize(img, (128, 128)) / 255.0
# #     img = img.reshape(1, 128, 128, 1)
# #     print("🔄 Image preprocessed")

# #     prediction = model.predict(img)
# #     print("✅ Prediction done")

# #     index = np.argmax(prediction)
# #     confidence = float(np.max(prediction))
# #     return jsonify({"blood_group": class_names[index], "confidence": confidence})





# @app.route('/predict', methods=['POST'])
# def predict():
#     file = request.files['image'].read()

#     # Convert image
#     nparr = np.frombuffer(file, np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
#     img = cv2.resize(img, (128, 128)) / 255.0
#     img = img.reshape(1, 128, 128, 1)

#     # Predict
#     prediction = model.predict(img)
#     index = np.argmax(prediction)
#     predicted_label = class_names[index]

#     # 🔥 INSERT INTO DB and RETURN ID
#     with engine.begin() as conn:
#         result = conn.execute(
#             text("""
#                 INSERT INTO fingerprints (image, predicted_blood)
#                 VALUES (:image, :predicted_blood)
#                 RETURNING id
#             """),
#             {
#                 "image": file,
#                 "predicted_blood": predicted_label
#             }
#         )
#         record_id = result.fetchone()[0]

#     return jsonify({
#         "blood_group": predicted_label,
#         "id": record_id
#     })




# @app.route('/verify', methods=['POST'])
# def verify():
#     data = request.json
#     record_id = data['id']
#     actual_blood = data['actual_blood']

#     with engine.begin() as conn:
#         conn.execute(
#             text("""
#                 UPDATE fingerprints
#                 SET actual_blood = :actual_blood,
#                     is_verified = TRUE
#                 WHERE id = :id
#             """),
#             {
#                 "id": record_id,
#                 "actual_blood": actual_blood
#             }
#         )

#     return jsonify({"message": "Verification updated successfully"})


# if __name__ == "__main__":
#     app.run(port=5000, debug=True)









import os
import cv2
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, text

# Database
engine = create_engine(
    "postgresql://postgres:Hamna%40123@localhost:5432/fingerprint_db"
)

app = Flask(__name__)
CORS(app)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "final_blood_model.h5")
CLASS_PATH = os.path.join(BASE_DIR, "models", "classes.txt")

# Load ML Model
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
with open(CLASS_PATH, "r") as f:
    class_names = [line.strip() for line in f.readlines()]


# ===================== PREDICT =====================
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image'].read()

    # Convert image
    nparr = np.frombuffer(file, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    img = cv2.resize(img, (128, 128)) / 255.0
    img = img.reshape(1, 128, 128, 1)

    # Predict
    prediction = model.predict(img)
    index = np.argmax(prediction)
    predicted_label = class_names[index]

    # Insert into DB & return ID
    with engine.begin() as conn:
        result = conn.execute(
            text("""
                INSERT INTO fingerprints (image, predicted_blood)
                VALUES (:image, :predicted_blood)
                RETURNING id
            """),
            {
                "image": file,
                "predicted_blood": predicted_label
            }
        )
        record_id = result.fetchone()[0]

    return jsonify({
        "blood_group": predicted_label,
        "id": record_id
    })


# ===================== VERIFY =====================
@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()

    record_id = data['id']
    actual_blood = data['actual_blood']

    with engine.begin() as conn:
        conn.execute(
            text("""
                UPDATE fingerprints
                SET actual_blood = :actual_blood,
                    is_verified = TRUE
                WHERE id = :id
            """),
            {
                "id": record_id,
                "actual_blood": actual_blood
            }
        )

    return jsonify({"message": "Verification updated successfully"})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
