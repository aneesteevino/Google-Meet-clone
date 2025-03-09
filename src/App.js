import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Meeting from './components/Meeting/Meeting';
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './components/Routes/PrivateRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#ea4335',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/meeting/:id"
            element={
              <PrivateRoute>
                <Meeting />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;