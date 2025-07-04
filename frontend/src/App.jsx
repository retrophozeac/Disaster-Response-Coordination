import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DisasterDetailPage from './pages/DisasterDetailPage';
import NewDisasterPage from './pages/NewDisasterPage';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Disaster Response Platform
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/disaster/new" element={<NewDisasterPage />} />
          <Route path="/disaster/:id" element={<DisasterDetailPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
