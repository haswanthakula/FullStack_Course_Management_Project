import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, Tag, message, Space, Typography, Checkbox } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';

const { Title } = Typography;

const courseImages = [
	'https://images.unsplash.com/photo-1523580494863-6f3031224c94', // online learning
	'https://images.unsplash.com/photo-1513258496099-48168024aec0', // computer science
	'https://images.unsplash.com/photo-1434030216411-0b793f4b4173', // education
	'https://images.unsplash.com/photo-1524178232363-1fb2b075b655', // classroom
	'https://images.unsplash.com/photo-1509062522246-3755977927d7', // technology
	'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b', // online courses
	'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', // studying
	'https://images.unsplash.com/photo-1552664730-d307ca884978', // education tech
	'https://images.unsplash.com/photo-1501504905252-473c47e087f8', // library
	'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e', // studying 2
	'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', // digital learning
	'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45', // science
];

const getImageUrl = (courseId) => {
	// Use a hash function to get better distribution
	const hash = courseId.split('').reduce((acc, char) => {
		return char.charCodeAt(0) + ((acc << 5) - acc);
	}, 0);
	const index = Math.abs(hash) % courseImages.length;
	return `${courseImages[index]}?auto=format&fit=crop&w=600&h=300`;
};

const StyledCard = styled(Card)`
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	.ant-card-head {
		border-bottom: 1px solid #f0f0f0;
	}
	.ant-table-wrapper {
		background: #fff;
		border-radius: 8px;
	}
`;

const PageHeader = styled.div`
	margin-bottom: 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const MyEnrollments = ({ onRefresh }) => {
	const [enrollments, setEnrollments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		if (user) {
			fetchEnrollments();
		}
	}, [user]);

	const fetchEnrollments = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('token');
			const response = await axios.get(
				`http://localhost:8080/api/enrollments/student/${user.id}`,
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);
			console.log('Fetched enrollments:', response.data); // Debug log
			if (Array.isArray(response.data)) {
				setEnrollments(response.data);
			} else {
				console.error('Invalid enrollments data:', response.data);
				message.error('Failed to fetch enrollments: Invalid data format');
			}
		} catch (error) {
			console.error('Error fetching enrollments:', error.response || error);
			message.error(`Failed to fetch enrollments: ${error.response?.data?.message || error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleCompletion = async (enrollmentId, completed) => {
		try {
			const token = localStorage.getItem('token');
			if (completed) {
				await axios.put(
					`http://localhost:8080/api/enrollments/${enrollmentId}/complete`,
					{},
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				message.success('Course marked as completed');
			} else {
				message.info('Course is already marked as in progress');
				return;
			}
			fetchEnrollments();
		} catch (error) {
			message.error('Failed to update course status');
			console.error('Error:', error);
		}
	};

	const handleUnenroll = async (enrollmentId) => {
		try {
			const token = localStorage.getItem('token');
			await axios.delete(
				`http://localhost:8080/api/enrollments/${enrollmentId}`,
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);
			message.success('Successfully unenrolled from course');
			fetchEnrollments();
			if (onRefresh) {
				onRefresh();
			}
		} catch (error) {
			message.error('Failed to unenroll from course');
			console.error('Error:', error);
		}
	};

	const columns = [
		{
			title: 'Course Title',
			dataIndex: ['course', 'title'],
			key: 'title',
			render: (text, record) => (
				<a onClick={() => setSelectedCourse(record.course)}>{text}</a>
			),
		},
		{
			title: 'Instructor',
			dataIndex: ['course', 'instructor'],
			key: 'instructor',
		},
		{
			title: 'Category',
			dataIndex: ['course', 'category'],
			key: 'category',
		},
		{
			title: 'Enrollment Date',
			dataIndex: 'enrollmentDate',
			key: 'enrollmentDate',
			render: (date) => new Date(date).toLocaleDateString(),
		},
		{
			title: 'Status',
			dataIndex: 'completed',
			key: 'status',
			render: (completed, record) => (
				<Space>
					<Checkbox
						checked={completed}
						onChange={(e) => handleCompletion(record.id, e.target.checked)}
					/>
					<Tag color={completed ? 'green' : 'blue'}>
						{completed ? 'Completed' : 'In Progress'}
					</Tag>
				</Space>
			),

		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button type="primary" onClick={() => setSelectedCourse(record.course)}>
						View Details
					</Button>
					<Button type="primary" danger onClick={() => {
						Modal.confirm({
							title: 'Confirm Unenrollment',
							content: 'Are you sure you want to unenroll from this course?',
							okText: 'Yes',
							cancelText: 'No',
							onOk: () => handleUnenroll(record.id)
						});
					}}>
						Unenroll
					</Button>
				</Space>
			),
		},
	];

	return (
		<>
			<PageHeader>
				<Title level={2}>My Enrollments</Title>
			</PageHeader>
			<StyledCard>
				<Table
					loading={loading}
					columns={columns}
					dataSource={enrollments}
					rowKey="id"
					pagination={{ 
						pageSize: 10,
						showTotal: (total) => `Total ${total} enrollments`
					}}
				/>
			</StyledCard>

			<Modal
				title={<Title level={3}>{selectedCourse?.title}</Title>}
				visible={!!selectedCourse}
				onCancel={() => setSelectedCourse(null)}
				footer={[
					<Button key="close" onClick={() => setSelectedCourse(null)}>
						Close
					</Button>
				]}
				width={600}
			>
				{selectedCourse && (
					<div>
						<img 
							src={getImageUrl(selectedCourse.id)} 
							alt={selectedCourse.title} 
							style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
						/>
						<p><strong>Instructor:</strong> {selectedCourse.instructor}</p>
						<p><strong>Category:</strong> {selectedCourse.category}</p>
						<p><strong>Level:</strong> {selectedCourse.level}</p>
						<p><strong>Language:</strong> {selectedCourse.language}</p>
						<p><strong>Price:</strong> ${selectedCourse.price}</p>
						<p><strong>Description:</strong> {selectedCourse.description}</p>
					</div>
				)}
			</Modal>
		</>
	);
};

export default MyEnrollments;