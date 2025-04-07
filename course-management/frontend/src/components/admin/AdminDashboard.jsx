import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Typography, Table, Button, message, Modal, Form } from 'antd';
import CourseForm from './CourseForm';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext';
import { UserOutlined, BookOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Sider } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
	min-height: 100vh;
`;

const StyledSider = styled(Sider)`
	background: #fff;
	height: 100vh;
	position: fixed;
	left: 0;
	z-index: 1;
	box-shadow: 2px 0 8px rgba(0,0,0,0.1);
`;

const MainLayout = styled(Layout)`
	margin-left: ${props => props.collapsed ? '80px' : '200px'};
	min-height: 100vh;
	background: #f0f2f5;
	transition: margin-left 0.2s;
`;

const ContentWrapper = styled.div`
	padding: 24px;
	min-height: calc(100vh - 48px);
	margin: 24px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const StyledCard = styled(Card)`
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	.ant-card-head {
		border-bottom: 1px solid #f0f0f0;
	}
	.ant-statistic-title {
		font-size: 16px;
	}
	.ant-statistic-content {
		font-size: 24px;
	}
`;

const PageHeader = styled.div`
	margin-bottom: 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const AdminDashboard = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [activeTab, setActiveTab] = useState('dashboard');
	const [courseModalVisible, setCourseModalVisible] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [form] = Form.useForm();
	const [stats, setStats] = useState({
		totalStudents: 0,
		totalCourses: 0,
		totalEnrollments: 0
	});
	const [students, setStudents] = useState([]);
	const [courses, setCourses] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchDashboardStats();
		fetchStudentEnrollmentCounts();
		fetchCourses();
	}, []);

	const fetchDashboardStats = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:8080/api/admin/stats', {
				headers: { Authorization: `Bearer ${token}` }
			});
			console.log('Stats response:', response.data); // Debug log
			setStats({
				totalStudents: response.data.totalStudents || 0,
				totalCourses: response.data.totalCourses || 0,
				totalEnrollments: response.data.totalEnrollments || 0
			});
		} catch (error) {
			console.error('Error fetching stats:', error.response || error);
			message.error('Failed to fetch dashboard statistics');
		}
	};

	const fetchStudentEnrollmentCounts = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:8080/api/admin/students/enrollment-counts', {
				headers: { Authorization: `Bearer ${token}` }
			});
			console.log('Student enrollment data:', response.data); // Debug log
			setStudents(response.data);
		} catch (error) {
			console.error('Error fetching student enrollment counts:', error);
			message.error('Failed to fetch student enrollment data');
		}
	};


	const fetchCourses = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:8080/api/admin/courses', {
				headers: { Authorization: `Bearer ${token}` }
			});
			console.log('Courses response:', response.data); // Debug log
			setCourses(response.data);
		} catch (error) {
			console.error('Error fetching courses:', error.response || error);
			message.error('Failed to fetch courses');
		}
	};

	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const studentColumns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Enrolled Courses',
			dataIndex: 'enrollmentCount',
			key: 'enrollmentCount',
		},
		{
			title: 'Joined Date',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date) => {
				console.log('Date value:', date); // Debug log
				return date ? new Date(date).toLocaleDateString() : 'N/A';
			},
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<Button type="link" danger onClick={() => handleDeleteUser(record.id)}>
					Delete
				</Button>
			),
		},
	];

	const courseColumns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Instructor',
			dataIndex: 'instructor',
			key: 'instructor',
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: (price) => `$${price}`,
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<>
					<Button type="link" onClick={() => handleEditCourse(record)}>
						Edit
					</Button>
					<Button type="link" danger onClick={() => handleDeleteCourse(record.id)}>
						Delete
					</Button>
				</>
			),
		},
	];

	const handleDeleteUser = async (userId) => {
		try {
			const token = localStorage.getItem('token');
			await axios.delete(`http://localhost:8080/api/admin/students/${userId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			message.success('User deleted successfully');
			fetchStudentEnrollmentCounts();
			fetchDashboardStats();
		} catch (error) {
			console.error('Error:', error);
			message.error('Failed to delete user');
		}
	};

	const handleAddCourse = () => {
		setSelectedCourse(null);
		form.resetFields();
		setCourseModalVisible(true);
	};

	const handleEditCourse = (course) => {
		setSelectedCourse(course);
		form.setFieldsValue(course);
		setCourseModalVisible(true);
	};

	const handleCourseSubmit = async (values) => {
		try {
			const token = localStorage.getItem('token');
			const courseData = {
				...values,
				id: selectedCourse ? selectedCourse.id : uuidv4()
			};

			if (selectedCourse) {
				await axios.put(
					`http://localhost:8080/api/admin/courses/${selectedCourse.id}`,
					courseData,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				);
				message.success('Course updated successfully');
			} else {
				await axios.post(
					'http://localhost:8080/api/admin/courses',
					courseData,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				);
				message.success('Course created successfully');
			}

			setCourseModalVisible(false);
			fetchCourses();
			fetchDashboardStats();
		} catch (error) {
			console.error('Error saving course:', error);
			message.error('Failed to save course');
		}
	};

	const handleDeleteCourse = async (courseId) => {
		try {
			const token = localStorage.getItem('token');
			
			// Check if course has enrollments
			const enrollmentResponse = await axios.get(
				`http://localhost:8080/api/admin/courses/${courseId}/enrollments`,
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);
			
			const hasEnrollments = enrollmentResponse.data;
			
			Modal.confirm({
				title: 'Delete Course',
				content: hasEnrollments 
					? 'This course has active enrollments. Deleting it will also remove all student enrollments. Are you sure you want to delete?' 
					: 'Are you sure you want to delete this course?',
				okText: 'Yes',
				okType: 'danger',
				cancelText: 'No',
				onOk: async () => {
					try {
						await axios.delete(`http://localhost:8080/api/admin/courses/${courseId}`, {
							headers: { Authorization: `Bearer ${token}` }
						});
						message.success('Course deleted successfully');
						fetchCourses();
						fetchDashboardStats();
					} catch (error) {
						const errorMessage = error.response?.data?.message || 'Failed to delete course';
						message.error(errorMessage);
						console.error('Error deleting course:', error);
					}
				}
			});
		} catch (error) {
			const errorMessage = error.response?.data?.message || 'Failed to check course enrollments';
			message.error(errorMessage);
			console.error('Error checking enrollments:', error);
		}
	};

	return (
		<StyledLayout>
			  <StyledSider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
				<div style={{ height: 64, background: '#001529', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				  <Title level={4} style={{ color: '#fff', margin: 0 }}>Admin</Title>
				</div>
				<Menu
				  mode="inline"
				  selectedKeys={[activeTab]}
				  style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
				  onClick={({ key }) => setActiveTab(key)}
				>
				  <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
					Dashboard
				  </Menu.Item>
				  <Menu.Item key="students" icon={<UserOutlined />}>
					Student Management
				  </Menu.Item>
				  <Menu.Item key="courses" icon={<BookOutlined />}>
					Course Management
				  </Menu.Item>
				  <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
					Logout
				  </Menu.Item>
				</Menu>
			  </StyledSider>
			  
			  <MainLayout collapsed={collapsed}>
				<ContentWrapper>
				  {activeTab === 'dashboard' && (
					<>
					  <PageHeader>
						<Title level={2}>Admin Dashboard</Title>
					  </PageHeader>
					  <Row gutter={[16, 16]}>
						<Col span={8}>
						  <StyledCard>
							<Card.Meta
							  title="Total Students"
							  description={<Title level={2}>{stats.totalStudents}</Title>}
							/>
						  </StyledCard>
						</Col>
						<Col span={8}>
						  <StyledCard>
							<Card.Meta
							  title="Total Courses"
							  description={<Title level={2}>{stats.totalCourses}</Title>}
							/>
						  </StyledCard>
						</Col>
						<Col span={8}>
						  <StyledCard>
							<Card.Meta
							  title="Total Enrollments"
							  description={<Title level={2}>{stats.totalEnrollments}</Title>}
							/>
						  </StyledCard>
						</Col>
					  </Row>
					</>
				  )}

				  {activeTab === 'students' && (
					<>
					  <PageHeader>
						<Title level={2}>Student Management</Title>
					  </PageHeader>
					  <Table
						columns={studentColumns}
						dataSource={students}
						rowKey="id"
						pagination={{ pageSize: 10 }}
					  />
					</>
				  )}

				  {activeTab === 'courses' && (
					<>
					  <PageHeader>
						<Title level={2}>Course Management</Title>
						<Button type="primary" onClick={handleAddCourse}>
						  Add New Course
						</Button>
					  </PageHeader>
					  <Table
						columns={courseColumns}
						dataSource={courses}
						rowKey="id"
						pagination={{ pageSize: 9 }}
					  />
					</>
				  )}
				<Modal
					title={selectedCourse ? 'Edit Course' : 'Add New Course'}
					visible={courseModalVisible}
					onCancel={() => setCourseModalVisible(false)}
					footer={[
						<Button key="cancel" onClick={() => setCourseModalVisible(false)}>
							Cancel
						</Button>,
						<Button key="submit" type="primary" onClick={() => form.submit()}>
							{selectedCourse ? 'Update' : 'Create'}
						</Button>
					]}
					width={600}
				>
					<CourseForm
						form={form}
						initialValues={selectedCourse}
						onFinish={handleCourseSubmit}
					/>
				</Modal>
			</ContentWrapper>
		  </MainLayout>
	</StyledLayout>
	);
};

export default AdminDashboard;