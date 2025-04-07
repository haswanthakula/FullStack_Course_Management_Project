import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Space, Tag, Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';

const { Title } = Typography;

const PageHeader = styled.div`
	margin-bottom: 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const StyledTable = styled(Table)`
	.ant-table {
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
`;

const StyledCard = styled(Card)`
	margin-bottom: 24px;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const StudentManagement = () => {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [enrollmentsVisible, setEnrollmentsVisible] = useState(false);
	const [studentEnrollments, setStudentEnrollments] = useState([]);

	useEffect(() => {
		fetchStudents();
	}, []);

	const fetchStudents = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:8080/api/admin/students', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setStudents(response.data);
		} catch (error) {
			message.error('Failed to fetch students');
		} finally {
			setLoading(false);
		}
	};

	const fetchStudentEnrollments = async (studentId) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(`http://localhost:8080/api/admin/students/${studentId}/enrollments`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setStudentEnrollments(response.data);
		} catch (error) {
			message.error('Failed to fetch student enrollments');
		}
	};

	const handleDeleteStudent = async (studentId) => {
		try {
			const token = localStorage.getItem('token');
			await axios.delete(`http://localhost:8080/api/admin/students/${studentId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			message.success('Student deleted successfully');
			fetchStudents();
		} catch (error) {
			message.error('Failed to delete student');
		}
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a, b) => a.email.localeCompare(b.email),
		},
		{
			title: 'Registration Date',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date) => new Date(date).toLocaleDateString(),
			sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
		},
		{
			title: 'Total Enrolled Courses',
			dataIndex: 'totalEnrolledCourses',
			key: 'totalEnrolledCourses',
			render: (total) => total || 0,
			sorter: (a, b) => (a.totalEnrolledCourses || 0) - (b.totalEnrolledCourses || 0),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button 
						type="primary"
						onClick={() => {
							setSelectedStudent(record);
							fetchStudentEnrollments(record.id);
							setEnrollmentsVisible(true);
						}}
					>
						View Enrollments
					</Button>
					<Button 
						type="primary" 
						danger 
						onClick={() => {
							Modal.confirm({
								title: 'Delete Student',
								content: 'Are you sure you want to delete this student? This action cannot be undone.',
								okText: 'Yes, Delete',
								okType: 'danger',
								cancelText: 'No',
								onOk: () => handleDeleteStudent(record.id)
							});
						}}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	const enrollmentColumns = [
		{
			title: 'Course Title',
			dataIndex: ['course', 'title'],
			key: 'courseTitle',
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
			render: (completed) => (
				<Tag color={completed ? 'green' : 'blue'}>
					{completed ? 'Completed' : 'In Progress'}
				</Tag>
			),
		},
	];

	return (
		<div>
			<PageHeader>
				<Title level={2}>Student Management</Title>
			</PageHeader>
			
			<StyledCard>
				<StyledTable
					loading={loading}
					columns={columns}
					dataSource={students}
					rowKey="id"
					pagination={{ 
						pageSize: 10,
						showTotal: (total) => `Total ${total} students`
					}}
				/>
			</StyledCard>

			<Modal
				title={
					<Space>
						<UserOutlined />
						<span>{selectedStudent?.name}'s Enrollments</span>
					</Space>
				}
				visible={enrollmentsVisible}
				onCancel={() => setEnrollmentsVisible(false)}
				width={800}
				footer={[
					<Button key="close" onClick={() => setEnrollmentsVisible(false)}>
						Close
					</Button>
				]}
			>
				<StyledTable
					columns={enrollmentColumns}
					dataSource={studentEnrollments}
					rowKey="id"
					pagination={{ 
						pageSize: 5,
						showTotal: (total) => `Total ${total} enrollments`
					}}
				/>
			</Modal>
		</div>
	);
};

export default StudentManagement;