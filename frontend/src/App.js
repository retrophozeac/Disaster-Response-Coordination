import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import DisasterDetail from './components/DisasterDetail';
import VerifyImage from './components/VerifyImage';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/disaster/:id" element={<DisasterDetail />} />
          <Route path="/verify" element={<VerifyImage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
