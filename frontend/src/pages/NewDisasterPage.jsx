import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createDisaster } from '../api';
import { fetchDisasters } from '../features/disasters/disastersSlice';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const NewDisasterPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDisaster = {
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
      };
      await createDisaster(newDisaster);
      dispatch(fetchDisasters());
      navigate('/');
    } catch (error) {
      console.error('Failed to create disaster:', error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create New Disaster
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="description"
          label="Description"
          id="description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          name="tags"
          label="Tags (comma-separated)"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create Disaster
        </Button>
      </Box>
    </Container>
  );
};

export default NewDisasterPage;
