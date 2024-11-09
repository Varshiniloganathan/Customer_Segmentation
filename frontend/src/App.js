import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [recency, setRecency] = useState('');
  const [frequency, setFrequency] = useState('');
  const [monetary, setMonetary] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [customerType, setCustomerType] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setError(null);
    try {
      const response = await axios.post('https://customer-segmentation-w63z.onrender.com/predict', {
        Recency: parseFloat(recency),
        Frequency: parseInt(frequency),
        Monetary: parseFloat(monetary)
      });
      setPrediction(response.data.predicted_cluster);
      setCustomerType(response.data.customer_type);
      setSuggestion(response.data.suggestion);
    } catch (error) {
      setError("Error: Please check input values or server connection.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', textAlign: 'center' }}>
      <h2>Customer Segment Prediction</h2>
      <input
        type="number"
        placeholder="Recency(days since last purchase)"
        value={recency}
        onChange={(e) => setRecency(e.target.value)}
      />
      <br /><br />
      <input
        type="number"
        placeholder="Frequency(purchases per year)"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      />
      <br /><br />
      <input
        type="number"
        placeholder="Monetary(total amount spent)"
        value={monetary}
        onChange={(e) => setMonetary(e.target.value)}
      />
      <br /><br />
      <button onClick={handlePredict}>Predict Segment</button>
      {prediction !== null && (
        <div>
          <h3>Predicted Cluster: {prediction}</h3>
          <p>{customerType}</p>
          <h4>Suggestions:</h4>
          <p>{suggestion}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    
  );
}

export default App;
