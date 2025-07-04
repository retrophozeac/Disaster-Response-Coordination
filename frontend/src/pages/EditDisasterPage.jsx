import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDisasters } from '../features/disasters/disastersSlice';
import { updateDisaster } from '../api';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const EditDisasterPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { disasters } = useSelector((state) => state.disasters);
  const disaster = disasters.find((d) => d.id === id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (disaster) {
      setTitle(disaster.title);
      setDescription(disaster.description);
      setTags(disaster.tags.join(', '));
    } else {
      dispatch(fetchDisasters());
    }
  }, [disaster, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedDisaster = {
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
      };
      await updateDisaster(id, updatedDisaster);
      dispatch(fetchDisasters());
      navigate(`/disaster/${id}`);
    } catch (error) {
      console.error('Failed to update disaster:', error);
    }
  };

  if (!disaster) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Disaster
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
          Update Disaster
        </Button>
      </Box>
    </Container>
  );
};

export default EditDisasterPage;
