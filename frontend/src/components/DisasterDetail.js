import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

function DisasterDetail() {
  const { id } = useParams();
  const [disaster, setDisaster] = useState(null);
  const [reports, setReports] = useState([]);
  const [resources, setResources] = useState([]);
  const [newReport, setNewReport] = useState({ content: '', imageUrl: '' });
  const [newResource, setNewResource] = useState({ name: '', location_name: '', type: '' });

  useEffect(() => {
    fetchDisasterDetails();

    const socket = io('http://localhost:3002');
    socket.emit('join_disaster_room', id);

    socket.on('social_media_updated', (newReport) => {
      setReports(prevReports => [...prevReports, newReport]);
    });

    socket.on('resources_updated', (newResource) => {
      setResources(prevResources => [...prevResources, newResource]);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const fetchDisasterDetails = () => {
    axios.get(`http://localhost:3002/api/disasters/${id}`)
      .then(response => {
        setDisaster(response.data);
      })
      .catch(error => {
        console.error('Error fetching disaster details:', error);
      });
    
    axios.get(`http://localhost:3002/api/disasters/${id}/reports`)
      .then(response => {
        setReports(response.data);
      })
      .catch(error => {
        console.error('Error fetching reports:', error);
      });

    axios.get(`http://localhost:3002/api/disasters/${id}/resources`)
      .then(response => {
        setResources(response.data);
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
      });
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3002/api/disasters/${id}/reports`, newReport)
      .then(() => {
        setNewReport({ content: '', imageUrl: '' });
        fetchDisasterDetails();
      })
      .catch(error => {
        console.error('Error creating report:', error);
      });
  };

  const handleCreateResource = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3002/api/disasters/${id}/resources`, newResource)
      .then(() => {
        setNewResource({ name: '', location_name: '', type: '' });
        fetchDisasterDetails();
      })
      .catch(error => {
        console.error('Error creating resource:', error);
      });
  };

  if (!disaster) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{disaster.title}</h2>
      <p>{disaster.description}</p>

      <hr />

      <h3>Reports</h3>
      <ul className="list-group mb-4">
        {reports.map(report => (
          <li key={report.id} className="list-group-item">
            <p>{report.content}</p>
            {report.image_url && <img src={report.image_url} alt="Report" style={{ maxWidth: '200px' }} />}
            <small className="text-muted">Status: {report.verification_status}</small>
          </li>
        ))}
      </ul>

      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">Submit a New Report</h4>
          <form onSubmit={handleCreateReport}>
            <div className="mb-3">
              <label htmlFor="reportContent" className="form-label">Content</label>
              <textarea
                className="form-control"
                id="reportContent"
                rows="3"
                value={newReport.content}
                onChange={e => setNewReport({ ...newReport, content: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                id="imageUrl"
                value={newReport.imageUrl}
                onChange={e => setNewReport({ ...newReport, imageUrl: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Report</button>
          </form>
        </div>
      </div>

      <hr />

      <h3>Resources</h3>
      <ul className="list-group mb-4">
        {resources.map(resource => (
          <li key={resource.id} className="list-group-item">
            <h5>{resource.name}</h5>
            <p>{resource.type} at {resource.location_name}</p>
          </li>
        ))}
      </ul>

      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Add a New Resource</h4>
          <form onSubmit={handleCreateResource}>
            <div className="mb-3">
              <label htmlFor="resourceName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="resourceName"
                value={newResource.name}
                onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="resourceLocation" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="resourceLocation"
                value={newResource.location_name}
                onChange={e => setNewResource({ ...newResource, location_name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="resourceType" className="form-label">Type</label>
              <input
                type="text"
                className="form-control"
                id="resourceType"
                value={newResource.type}
                onChange={e => setNewResource({ ...newResource, type: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Resource</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DisasterDetail;
