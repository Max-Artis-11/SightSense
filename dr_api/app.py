from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torch.nn as nn
from torchvision import models, transforms
import io

app = Flask(__name__)
CORS(app)

# === DR Model Stuff ===
def build_model():
    model = models.densenet121(weights=None)  # No pretrained weights
    num_ftrs = model.classifier.in_features
    model.classifier = nn.Linear(num_ftrs, 5)  # 5 classes for DR
    return model

# Load the trained model
model = build_model()
model.load_state_dict(torch.load("C:/Users/maxim/Desktop/SIGHTSENSEAI/dr_api/best_densenet121_model.pth", map_location=torch.device("cpu")))
model.eval()

# Class labels for DR
class_labels = {
    0: "No Diabetic Retinopathy",
    1: "Mild Diabetic Retinopathy",
    2: "Moderate Diabetic Retinopathy",
    3: "Severe Diabetic Retinopathy",
    4: "Proliferative Diabetic Retinopathy"
}

# Image transformation
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read and process the image
        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        image = transform(image).unsqueeze(0)

        # Predict using the model
        with torch.no_grad():
            outputs = model(image)
            _, predicted = torch.max(outputs, 1)
            class_index = predicted.item()
            diagnosis = class_labels.get(class_index, "Unknown")

        return jsonify({'diagnosis': diagnosis})
    except Exception as e:
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/')
def home():
    return "Flask API is running."

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
