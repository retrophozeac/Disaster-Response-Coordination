import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisasterList from './DisasterList';

function Home() {
  const [disasters, setDisasters] = useState([]);
  const [newDisaster, setNewDisaster] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = () => {
    axios.get('http://localhost:3002/api/disasters')
      .then(response => {
        setDisasters(response.data);
      })
      .catch(error => {
        console.error('Error fetching disasters:', error);
      });
  };

  const handleCreateDisaster = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3002/api/disasters', newDisaster)
      .then(() => {
        setNewDisaster({ title: '', description: '' });
        fetchDisasters(); // Refetch disasters to show the new one
      })
      .catch(error => {
        console.error('Error creating disaster:', error);
      });
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Create New Disaster</h2>
          <form onSubmit={handleCreateDisaster}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="e.g., Hurricane Zen"
                value={newDisaster.title}
                onChange={e => setNewDisaster({ ...newDisaster, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                placeholder="e.g., A major hurricane making landfall in Florida."
                value={newDisaster.description}
                onChange={e => setNewDisaster({ ...newDisaster, description: e.target.value })}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Create Disaster</button>
          </form>
        </div>
      </div>
      <DisasterList disasters={disasters} />
    </div>
  );
}

export default Home;
