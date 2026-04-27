import axios from 'axios';

// Shared Axios instance used by all DataService files.
// withCredentials is required because the JWT is stored as an HTTP-only cookie.
const http = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// When the backend rejects an expired/invalid session, clear frontend state.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = (error.response?.data?.error || '').toLowerCase();
    const isAuthSessionError = (status === 401 || status === 403)
      && (message.includes('token') || message.includes('session') || message.includes('access denied'));

    if (isAuthSessionError) {
      localStorage.removeItem('myevents_user');
      window.dispatchEvent(new CustomEvent('myevents:auth-expired'));
    }

    return Promise.reject(error);
  }
);

export default http;
