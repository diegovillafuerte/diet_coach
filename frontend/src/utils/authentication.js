import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', {
        email, 
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      
      const data = response.data;
      // If login is successful, a token will be returned
      if (data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
      }
      const user_data = JSON.stringify({ email, password });
      localStorage.setItem('user', user_data);
      setUser(user_data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/register', {
        email,
        password,
        name
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear the user data
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
