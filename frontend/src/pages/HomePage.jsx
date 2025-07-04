import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDisasters } from '../features/disasters/disastersSlice';
import { Button, Container, Typography, List, ListItem, ListItemText, TextField, Box, Card } from '@mui/material';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tags, setTags] = useState('');
  const { disasters, loading, error } = useSelector((state) => state.disasters);

  useEffect(() => {
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    dispatch(fetchDisasters(tagsArray));
  }, [dispatch, tags]);

  return (
    <Container>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error.message}</Typography>}
      <Typography variant="h4" gutterBottom>
        Active Disasters
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button onClick={() => navigate('/disaster/new')} variant="contained" color="primary">
          Create New Disaster
        </Button>
        <TextField
          label="Filter by Tags (comma-separated)"
          variant="outlined"
          size="small"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          sx={{ width: '300px' }}
        />
      </Box>
      {!loading && !error && (
      <List>
        {disasters.map((disaster) => (
          <Card key={disaster.id} sx={{ mb: 2 }}>
            <ListItem
              onClick={() => navigate(`/disaster/${disaster.id}`)}
              sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemText primary={disaster.title} secondary={disaster.description} />
            </ListItem>
          </Card>
        ))}
      </List>
      )}
    </Container>
  );
};

export default HomePage;
