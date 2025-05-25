import  { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


export const AuthProvider = ({children}) => {
  const [user, setUser] = useState('demo');
  
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Check for token on app load
  // useEffect(() => {
  //   if (user) {
  //     console.log("User updated:", user);
  //   }
  // }, [user]);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const api = axios.create({
    baseURL: 'http://localhost:5002',  // Make sure this matches your backend URL
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  const login = async (credentials) => {
    
    setError(null);
    console.log('credentials',credentials)
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('response-data',response.data);
      setUser(response.data.userType);
      console.log(user);
      localStorage.setItem('user', response.data.userType);
      // newToken = response.data.token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('id1', response.data.patientID);
      if (response.data.token){
        setToken(response.data.token)
      }
      else{
        setToken(null)
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      
      throw err;
    }
  };

  
    const signup = async (userData) => {
      
      setError(null);
      try {
          const response = await api.post('/auth/signup', userData);
          console.log('awaw', response);
  
          if (response.status === 400) {
              console.log('Error 400:', response.data.message);
              setError(response.data.message);

              return;
          }
  
          setUser(response.data.userType);
          localStorage.setItem('user', response.data.userType);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('id1', response.data.patientID);
  
          if (response.data.token) {
              setToken(response.data.token);
          } else {
              setToken(null);
          }
  
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

          return response.data;
      } catch (err) {
          setError(err.response?.data?.message || 'An error occurred during signup');
          throw err;
      }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('id1');
    localStorage.removeItem('user');
    setToken(null)
    delete api.defaults.headers.common['Authorization'];
    console.log('LogOut is Completed')
    navigate('/auth');
  };

  const checkAuthStatus = async () => {
    

    const token = localStorage.getItem('token');
    if (token) {
      setToken(token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await api.get('/auth/me'); // Assuming you have a /me endpoint to get user data
        setUser(response.data.userType);
      } catch (err) {
        console.error('Error checking auth status:', err);
        setToken(null)
        logout(); // If token is invalid or expired, log out the user
      }
    }
  };

//   useEffect(() => {
//     checkAuthStatus();
// }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout,  error, token, setToken, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

