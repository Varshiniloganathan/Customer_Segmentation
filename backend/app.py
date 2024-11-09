from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
# Load the scaler and KMeans model
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)
with open('kmeans_model.pkl', 'rb') as f:
    kmeans = pickle.load(f)

# Route to predict customer segment
@app.route('/predict', methods=['POST'])
def predict_segment():
    data = request.json
    recency = data.get('Recency')
    frequency = data.get('Frequency')
    monetary = data.get('Monetary')

    # Check if all fields are provided
    if recency is None or frequency is None or monetary is None:
        return jsonify({'error': 'All fields (Recency, Frequency, Monetary) are required'}), 400

    # Prepare data for prediction
    input_data = np.array([[recency, frequency, monetary]])
    input_scaled = scaler.transform(input_data)
    cluster = kmeans.predict(input_scaled)[0]
    # Customer types and suggestions based on cluster predictions
    customer_info = {
        0: {
            "type": "High Value Customer",
            "suggestion": "Keep engaging with this customer. Offer loyalty programs and exclusive deals to retain their interest."
        },
        1: {
            "type": "At-Risk Customer",
            "suggestion": "This customer hasn't purchased in a while. Offer discounts or personalized recommendations to re-engage them."
        },
        2: {
            "type": "Low Value Customer",
            "suggestion": "Consider offering small discounts or bundling products to increase purchase frequency."
        }
    }

    customer_data = customer_info.get(cluster, {
        "type": "Unknown Customer Type",
        "suggestion": "No suggestion available."
    })

    return jsonify({
        'predicted_cluster': int(cluster),
        'customer_type': customer_data['type'],
        'suggestion': customer_data['suggestion']
    })

if __name__ == '__main__':
    app.run(debug=True)
