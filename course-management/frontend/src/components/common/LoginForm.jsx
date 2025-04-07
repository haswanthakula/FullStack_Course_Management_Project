import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StyledForm = styled(Form)`
	max-width: 300px;
	margin: 0 auto;
`;

const LoginForm = ({ onClose }) => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const onFinish = async (values) => {
		try {
			setLoading(true);
			console.log('Attempting login with email:', values.email);
			const userData = await login(values.email, values.password);
			console.log('Login successful:', userData);
			onClose();

			if (userData.role === 'ROLE_ADMIN') {
				navigate('/admin-dashboard');
			} else if (userData.role === 'ROLE_STUDENT') {
				navigate(`/student-dashboard/${userData.id}`);
			}
		} catch (error) {
			console.error('Login error:', error);
			if (error.response) {
				message.error('Login failed: ' + (error.response.data?.message || 'Invalid credentials'));
			} else {
				message.error('Login failed: Network error');
			}
		} finally {
			setLoading(false);
		}
	};


	return (
		<StyledForm
			name="login"
			onFinish={onFinish}
			autoComplete="off"
		>
			<Form.Item
				name="email"
				rules={[
					{ required: true, message: 'Please input your email!' },
					{ type: 'email', message: 'Please enter a valid email!' }
				]}
			>
				<Input prefix={<UserOutlined />} placeholder="Email" />
			</Form.Item>

			<Form.Item
				name="password"
				rules={[{ required: true, message: 'Please input your password!' }]}
			>
				<Input.Password prefix={<LockOutlined />} placeholder="Password" />
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit" loading={loading} block>
					Log in
				</Button>
			</Form.Item>
		</StyledForm>
	);
};

export default LoginForm;