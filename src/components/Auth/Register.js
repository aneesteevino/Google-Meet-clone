import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response.data && response.data.message) {
        // Registration successful
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '4rem' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!error && !formData.name}
          />
          <TextField
            required
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!error && !formData.email}
          />
          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={!!error && !formData.password}
          />
          <TextField
            required
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={!!error && !formData.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            style={{ marginTop: '0.5rem' }}
          >
            Already have an account? Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Register;