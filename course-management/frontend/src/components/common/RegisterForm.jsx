import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';


const StyledForm = styled(Form)`
	max-width: 300px;
	margin: 0 auto;
`;

const RegisterForm = ({ onClose }) => {
	const [loading, setLoading] = useState(false);
	const { register } = useAuth();

	const onFinish = async (values) => {
		try {
			setLoading(true);
			const userData = {
				name: values.name,
				email: values.email,
				password: values.password,
				role: 'ROLE_STUDENT' // Set default role as student
			};
			
			await register(userData);
			message.success('Registration successful! Please login to continue.');
			onClose();
		} catch (error) {
			console.error('Registration error:', error);
			message.error('Registration failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<StyledForm
			name="register"
			onFinish={onFinish}
			autoComplete="off"
		>
			<Form.Item
				name="name"
				rules={[{ required: true, message: 'Please input your name!' }]}
			>
				<Input prefix={<UserOutlined />} placeholder="Full Name" />
			</Form.Item>

			<Form.Item
				name="email"
				rules={[
					{ required: true, message: 'Please input your email!' },
					{ type: 'email', message: 'Please enter a valid email!' }
				]}
			>
				<Input prefix={<MailOutlined />} placeholder="Email" />
			</Form.Item>

			<Form.Item
				name="password"
				rules={[
					{ required: true, message: 'Please input your password!' },
					{ min: 6, message: 'Password must be at least 6 characters!' }
				]}
			>
				<Input.Password prefix={<LockOutlined />} placeholder="Password" />
			</Form.Item>

			<Form.Item
				name="confirm"
				dependencies={['password']}
				rules={[
					{ required: true, message: 'Please confirm your password!' },
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve();
							}
							return Promise.reject(new Error('Passwords do not match!'));
						},
					}),
				]}
			>
				<Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
			</Form.Item>




			<Form.Item>
				<Button type="primary" htmlType="submit" loading={loading} block>
					Register
				</Button>
			</Form.Item>
		</StyledForm>
	);
};

export default RegisterForm;