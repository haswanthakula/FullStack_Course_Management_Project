import api from './api';

const authService = {
	login: async (credentials) => {
		const response = await api.post('/auth/login', credentials);
		if (response.data.token) {
			localStorage.setItem('token', response.data.token);
		}
		return response.data;
	},

	register: async (userData) => {
		const response = await api.post('/auth/register', userData);
		return response.data;
	},

	logout: () => {
		localStorage.removeItem('token');
	},

	getCurrentUser: () => {
		const token = localStorage.getItem('token');
		if (token) {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			return JSON.parse(window.atob(base64));
		}
		return null;
	},

	isAuthenticated: () => {
		const token = localStorage.getItem('token');
		return !!token;
	},

	getToken: () => {
		return localStorage.getItem('token');
	},

	hasRole: (requiredRole) => {
		const user = authService.getCurrentUser();
		return user && user.roles.includes(requiredRole);
	}
};

export default authService;