import React, { useState } from 'react';
import axios from 'axios';

function VerifyImage() {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState(null);

  const handleVerify = () => {
    axios.post('http://localhost:3002/api/verification', { imageUrl })
      .then(response => {
        setResult(response.data);
      })
      .catch(error => {
        console.error('Error verifying image:', error);
      });
  };

  return (
    <div>
      <h2>Verify Image Authenticity</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Image URL"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleVerify}>Verify</button>
      </div>

      {result && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Verification Result</h5>
            <p className="card-text">Authentic: {result.authentic ? 'Yes' : 'No'}</p>
            <p className="card-text">Confidence: {result.confidence}</p>
            <p className="card-text">Reasoning: {result.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyImage;
