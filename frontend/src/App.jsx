import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DisasterDetailPage from './pages/DisasterDetailPage';
import NewDisasterPage from './pages/NewDisasterPage';
import EditDisasterPage from './pages/EditDisasterPage';
import NearbyResourcesPage from './pages/NearbyResourcesPage';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

function App() {
  const navigate = useNavigate();
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Disaster Response Platform
          </Typography>
          <Button color="inherit" onClick={() => navigate('/resources/nearby')}>Nearby Resources</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/disaster/new" element={<NewDisasterPage />} />
          <Route path="/disaster/:id" element={<DisasterDetailPage />} />
          <Route path="/disaster/edit/:id" element={<EditDisasterPage />} />
          <Route path="/resources/nearby" element={<NearbyResourcesPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
