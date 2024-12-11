const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // empty string for same-origin requests
  : 'http://localhost:8080';

export default API_URL; 