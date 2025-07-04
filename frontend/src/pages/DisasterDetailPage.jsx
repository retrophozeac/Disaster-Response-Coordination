import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDisasters } from '../features/disasters/disastersSlice';
import { fetchReports } from '../features/reports/reportsSlice';
import { fetchResources } from '../features/resources/resourcesSlice';
import { createReport, createResource } from '../api';
import { Container, Typography, Card, CardContent, CardMedia, List, ListItem, ListItemText, Divider, TextField, Button, Box } from '@mui/material';

const ReportForm = ({ disasterId }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReport(disasterId, { content, image_url: imageUrl });
      dispatch(fetchReports(disasterId));
      setContent('');
      setImageUrl('');
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      <Typography variant="h6">Submit a Report</Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Report Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        rows={3}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Image URL (Optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
        Submit Report
      </Button>
    </Box>
  );
};

const ResourceForm = ({ disasterId }) => {
  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [type, setType] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createResource(disasterId, { name, location_name: locationName, type });
      dispatch(fetchResources(disasterId));
      setName('');
      setLocationName('');
      setType('');
    } catch (error) {
      console.error('Failed to create resource:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      <Typography variant="h6">Add a Resource</Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Resource Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Location"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Type (e.g., shelter, medical)"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
        Add Resource
      </Button>
    </Box>
  );
};

const DisasterDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { disasters, loading: disastersLoading, error: disastersError } = useSelector((state) => state.disasters);
  const { reports, loading: reportsLoading, error: reportsError } = useSelector((state) => state.reports);
  const { resources, loading: resourcesLoading, error: resourcesError } = useSelector((state) => state.resources);

  const disaster = disasters.find((d) => d.id === id);

  useEffect(() => {
    if (!disaster) {
      dispatch(fetchDisasters());
    }
    dispatch(fetchReports(id));
    dispatch(fetchResources(id));
  }, [id, dispatch, disaster]);

  return (
    <Container>
      {(disastersLoading || reportsLoading || resourcesLoading) && <Typography>Loading...</Typography>}
      {(disastersError || reportsError || resourcesError) && <Typography color="error">Error loading data.</Typography>}
      {!disaster && !disastersLoading && <Typography>Disaster not found.</Typography>}
      {disaster && (
        <>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {disaster.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {disaster.description}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        Reports
      </Typography>
      <List>
        {reports.map((report) => (
          <React.Fragment key={report.id}>
            <ListItem alignItems="flex-start">
              {report.image_url && (
                <CardMedia
                  component="img"
                  style={{ width: 150, marginRight: 20 }}
                  image={report.image_url}
                  alt="Report image"
                />
              )}
              <ListItemText
                primary={report.content}
                secondary={`Reported at: ${new Date(report.created_at).toLocaleString()}`}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>

      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        Resources
      </Typography>
      <List>
        {resources.map((resource) => (
          <ListItem key={resource.id}>
            <ListItemText primary={resource.name} secondary={`Location: ${resource.location_name}`} />
          </ListItem>
        ))}
      </List>

      <Divider style={{ margin: '40px 0' }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <ReportForm disasterId={id} />
        <ResourceForm disasterId={id} />
      </Box>
        </>
      )}
    </Container>
  );
};

export default DisasterDetailPage;
