import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDisasters } from '../features/disasters/disastersSlice';
import { fetchReports } from '../features/reports/reportsSlice';
import { fetchResources } from '../features/resources/resourcesSlice';
import { createReport, createResource, deleteDisaster } from '../api';
import { Container, Typography, Card, CardContent, CardMedia, List, ListItem, ListItemText, Divider, TextField, Button, Box, Chip, Grid, Tab, Tabs } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

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
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} startIcon={<SendIcon />}>
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
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} startIcon={<SendIcon />}>
        Add Resource
      </Button>
    </Box>
  );
};

const DisasterDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const { disasters, loading: disastersLoading, error: disastersError } = useSelector((state) => state.disasters);
  const { reports, loading: reportsLoading, error: reportsError } = useSelector((state) => state.reports);
  const { resources, loading: resourcesLoading, error: resourcesError } = useSelector((state) => state.resources);

  const disaster = disasters.find((d) => d.id === id);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this disaster?')) {
      try {
        await deleteDisaster(id);
        dispatch(fetchDisasters());
        navigate('/');
      } catch (error) {
        console.error('Failed to delete disaster:', error);
      }
    }
  };

  useEffect(() => {
    if (!disaster) {
      dispatch(fetchDisasters());
    }
    dispatch(fetchReports(id));
    dispatch(fetchResources(id));
  }, [id, dispatch, disaster]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container>
      {(disastersLoading || reportsLoading || resourcesLoading) && <Typography>Loading...</Typography>}
      {(disastersError || reportsError || resourcesError) && <Typography color="error">Error loading data.</Typography>}
      {!disaster && !disastersLoading && <Typography>Disaster not found.</Typography>}
      {disaster && (
        <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
              {disaster.title}
            </Typography>
            <Box>
              <Button variant="outlined" sx={{ mr: 1 }} startIcon={<EditIcon />} onClick={() => navigate(`/disaster/edit/${id}`)}>Edit</Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>Delete</Button>
            </Box>
          </Box>
          <Typography variant="h6" gutterBottom>
            {disaster.location_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {disaster.description}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="disaster details tabs">
          <Tab label="Reports" />
          <Tab label="Resources" />
          <Tab label="Contribute" />
        </Tabs>
      </Box>
      {tabValue === 0 && (
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
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {`Reported at: ${new Date(report.created_at).toLocaleString()}`}
                      </Typography>
                      <Chip
                        label={report.verification_status || 'pending'}
                        size="small"
                        color={
                          report.verification_status === 'verified'
                            ? 'success'
                            : report.verification_status === 'debunked'
                            ? 'error'
                            : 'default'
                        }
                        sx={{ ml: 1 }}
                      />
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
      {tabValue === 1 && (
        <List>
          {resources.map((resource) => (
            <ListItem key={resource.id}>
              <ListItemText primary={resource.name} secondary={`Location: ${resource.location_name}`} />
            </ListItem>
          ))}
        </List>
      )}
      {tabValue === 2 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ReportForm disasterId={id} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ResourceForm disasterId={id} />
          </Grid>
        </Grid>
      )}
        </>
      )}
    </Container>
  );
};

export default DisasterDetailPage;
