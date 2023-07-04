import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/authentication';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import ProgressPage from './pages/ProgressPage';
import PrivateRoute from './components/PrivateRoute';
import AuthenticationPage from './pages/AuthenticationPage';
import axios from 'axios';

let baseURL;

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://127.0.0.1:5000';
} else {
  baseURL = 'https://shrouded-coast-01737.herokuapp.com'; // replace with your Heroku app URL
}
axios.defaults.baseURL = baseURL;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthenticationPage />} />
          <Route path="/register" element={<AuthenticationPage />} />
          <Route path="/progress" element={
            <PrivateRoute>
              <ProgressPage />
            </PrivateRoute>
          } />          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
