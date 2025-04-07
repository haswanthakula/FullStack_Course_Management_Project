import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:8080/api',
	headers: {
		'Content-Type': 'application/json'
	}
});

// Request interceptor
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

// Response interceptor
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('Response error:', error);
		if (error.response) {
			// Handle 401 Unauthorized
			if (error.response.status === 401) {
				console.log('Unauthorized access, clearing token');
				localStorage.removeItem('token');
				window.location.href = '/';
			}
			// Return the error response data
			return Promise.reject(error.response.data);
		}
		return Promise.reject(error);
	}
);

export default api;