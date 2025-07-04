import React from 'react';
import { Link } from 'react-router-dom';

function DisasterList({ disasters }) {
  return (
    <div>
      <h2>Disasters</h2>
      <ul className="list-group">
        {disasters.map(disaster => (
          <li key={disaster.id} className="list-group-item">
            <Link to={`/disaster/${disaster.id}`}>{disaster.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisasterList;
