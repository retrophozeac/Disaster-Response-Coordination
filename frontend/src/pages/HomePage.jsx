import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDisasters } from '../features/disasters/disastersSlice';
import { Button, Container, Typography, TextField, Box, Card, CardContent, CardActions, Grid } from '@mui/material';

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Active Disasters
        </Typography>
        <Button onClick={() => navigate('/disaster/new')} variant="contained" color="primary">
          Create New Disaster
        </Button>
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Filter by Tags (comma-separated)"
          variant="outlined"
          fullWidth
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </Box>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error.message}</Typography>}
      <Grid container spacing={4}>
        {disasters.map((disaster) => (
          <Grid item key={disaster.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {disaster.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {disaster.location_name}
                </Typography>
                <Typography>
                  {disaster.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/disaster/${disaster.id}`)}>View Details</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
