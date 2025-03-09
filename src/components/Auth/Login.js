import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', formData); // Debug log
      const response = await login(formData);
      console.log('Login response:', response); // Debug log

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error.response || error); // Debug log
      setError(
        error.response?.data?.message || 
        'Unable to connect to server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '4rem' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
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
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
          />
          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
            style={{ marginTop: '0.5rem' }}
            disabled={loading}
          >
            Don't have an account? Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;