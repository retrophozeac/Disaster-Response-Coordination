import React, { useState } from 'react';
import { findNearbyResources } from '../api';
import { Container, Typography, TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';

const NearbyResourcesPage = () => {
  const [locationName, setLocationName] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await findNearbyResources({ location_name: locationName });
      setResources(data);
    } catch (error) {
      setError(error.response.data);
    }
    setLoading(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Find Nearby Resources
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="locationName"
          label="Location Name"
          name="locationName"
          autoFocus
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>
      {error && <Typography color="error">Error: {error.message}</Typography>}
      <List>
        {resources.map((resource) => (
          <ListItem key={resource.id}>
            <ListItemText
              primary={resource.name}
              secondary={`Location: ${resource.location_name} (${(resource.distance / 1000).toFixed(2)} km away)`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default NearbyResourcesPage;
