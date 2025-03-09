import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Box, 
  Paper,
  Grid 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createMeeting } from '../../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState('');
  const [error, setError] = useState('');

  const handleCreateMeeting = async () => {
    try {
      const response = await createMeeting();
      console.log('Meeting creation response:', response); // Debug log
      if (response.data && response.data.meetingId) {
        navigate(`/meeting/${response.data.meetingId}`);
      } else {
        setError('Failed to create meeting');
      }
    } catch (error) {
      console.error('Failed to create meeting:', error);
      setError('Failed to create meeting. Please try again.');
    }
  };

  const handleJoinMeeting = () => {
    if (meetingId.trim()) {
      navigate(`/meeting/${meetingId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Welcome to Google Meet Clone
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleCreateMeeting}
              >
                Create New Meeting
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Enter Meeting Code"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                />
                <Button 
                  variant="contained" 
                  onClick={handleJoinMeeting}
                  disabled={!meetingId.trim()}
                >
                  Join
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button 
                variant="outlined" 
                color="secondary" 
                fullWidth 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default Dashboard;