import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Space, Typography } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';

const { Title } = Typography;

const StyledCard = styled(Card)`
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	margin-bottom: 24px;
	.ant-card-head {
		border-bottom: 1px solid #f0f0f0;
	}
`;

const PageHeader = styled.div`
	margin-bottom: 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const ProfileUpdate = () => {
	const { user } = useAuth();
	const [form] = Form.useForm();
	const [passwordForm] = Form.useForm();

	const handleProfileUpdate = async (values) => {
		try {
			const token = localStorage.getItem('token');
			await axios.put(
				`http://localhost:8080/api/users/${user.id}/profile`,
				values,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			message.success('Profile updated successfully');
		} catch (error) {
			message.error('Failed to update profile');
			console.error('Error:', error);
		}
	};

	const handlePasswordUpdate = async (values) => {
		try {
			const token = localStorage.getItem('token');
			await axios.put(
				`http://localhost:8080/api/users/${user.id}/password`,
				{
					oldPassword: values.currentPassword,
					newPassword: values.newPassword
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			passwordForm.resetFields();
			message.success('Password updated successfully');
		} catch (error) {
			message.error('Failed to update password');
			console.error('Error:', error);
		}
	};

	return (
		<>
			<PageHeader>
				<Title level={2}>Profile Settings</Title>
			</PageHeader>
			<StyledCard title="Update Profile">
				<Form
					form={form}
					layout="vertical"
					onFinish={handleProfileUpdate}
					initialValues={{ name: user?.name }}
				>
					<Form.Item
						name="name"
						label="Name"
						rules={[{ required: true, message: 'Please input your name!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Update Profile
						</Button>
					</Form.Item>
				</Form>
			</StyledCard>

			<StyledCard title="Change Password">
				<Form
					form={passwordForm}
					layout="vertical"
					onFinish={handlePasswordUpdate}
				>
					<Form.Item
						name="currentPassword"
						label="Current Password"
						rules={[{ required: true, message: 'Please input your current password!' }]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name="newPassword"
						label="New Password"
						rules={[
							{ required: true, message: 'Please input your new password!' },
							{ min: 6, message: 'Password must be at least 6 characters!' }
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name="confirmPassword"
						label="Confirm Password"
						dependencies={['newPassword']}
						rules={[
							{ required: true, message: 'Please confirm your password!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('newPassword') === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Passwords do not match!'));
								},
							}),
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Update Password
						</Button>
					</Form.Item>
				</Form>
			</StyledCard>
		</>
	);
};

export default ProfileUpdate;