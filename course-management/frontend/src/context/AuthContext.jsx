import React, { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const base64Url = token.split('.')[1];
				const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
				const payload = JSON.parse(window.atob(base64));
				
				setUser({
					id: payload.id,
					name: payload.name,
					email: payload.email,
					role: payload.role
				});
			} catch (error) {
				console.error('Error decoding token:', error);
				localStorage.removeItem('token');
			}
		}
		setLoading(false);
	}, []);

	const login = async (email, password) => {
		try {
			const response = await axios.post('http://localhost:8080/api/auth/login', {
				email,
				password
			});
			
			const { token, user } = response.data;
			localStorage.setItem('token', token);
			
			const userData = {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role
			};
			
			setUser(userData);
			message.success('Successfully logged in!');
			
			return userData;
		} catch (error) {
			console.error('Login error:', error);
			message.error('Login failed: ' + (error.response?.data?.message || 'Invalid credentials'));
			throw error;
		}
	};


	const register = async (userData) => {
		try {
			await axios.post('http://localhost:8080/api/auth/register', userData);
			message.success('Registration successful! Please login.');
		} catch (error) {
			message.error('Registration failed: ' + (error.response?.data?.message || 'Unknown error'));
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		message.success('Successfully logged out!');
	};

	const value = {
		user,
		loading,
		login,
		register,
		logout
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};