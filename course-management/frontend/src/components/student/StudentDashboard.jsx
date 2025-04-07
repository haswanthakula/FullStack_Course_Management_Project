import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Typography, Button, Avatar } from 'antd';
import axios from 'axios';
import { UserOutlined, DashboardOutlined, BookOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate, useParams, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MyEnrollments from './MyEnrollments';
import AllCourses from '../../pages/AllCourses';
import ProfileUpdate from './ProfileUpdate';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

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
	margin-left: ${props => props.collapsed ? '80px' : '250px'};
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
`;

const StudentDashboard = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [profile, setProfile] = useState(null);
	const [stats, setStats] = useState({

		total: 0,
		completed: 0,
		inProgress: 0
	});
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams();
	const location = useLocation();
	const refreshDashboard = () => {

		fetchEnrollmentStats();
	};

	useEffect(() => {
		fetchStudentData();
		fetchEnrollmentStats();
	}, [id]);

	const fetchEnrollmentStats = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(
				`http://localhost:8080/api/enrollments/student/${id}/stats`,
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);
			setStats(response.data);
		} catch (error) {
			console.error('Error fetching enrollment stats:', error);
		}
	};

	const fetchStudentData = async () => {
		try {
			setProfile(user);
		} catch (error) {
			console.error('Error fetching student data:', error);
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/');
	};




	const getSelectedKey = () => {
		const path = location.pathname;
		if (path.includes('/student-dashboard')) {
			if (path.includes('/enrollments')) return 'enrollments';
			if (path.includes('/courses')) return 'courses';
			if (path.includes('/profile')) return 'profile';
			return 'dashboard';
		}
		return '';
	};

	const renderDashboardContent = () => (
		<div>
			<StyledCard title="Profile Information">
				<Row gutter={[16, 16]} align="middle">
					<Col span={4}>
						<Avatar size={80} icon={<UserOutlined />} />
					</Col>
					<Col span={16}>
						<Title level={4}>{profile?.name}</Title>
						<Text>Email: {profile?.email}</Text>
					</Col>
					<Col span={4}>
						<Button type="primary" onClick={() => navigate(`/student-dashboard/${id}/profile`)}>
							Edit Profile
						</Button>
					</Col>
				</Row>
			</StyledCard>

			<Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
				<Col span={8}>
					<StyledCard>
						<Card.Meta
							title="Total Enrollments"
							description={<Title level={2}>{stats.total}</Title>}
						/>
					</StyledCard>
				</Col>
				<Col span={8}>
					<StyledCard>
						<Card.Meta
							title="Completed Courses"
							description={<Title level={2}>{stats.completed}</Title>}
						/>
					</StyledCard>
				</Col>
				<Col span={8}>
					<StyledCard>
						<Card.Meta
							title="In Progress"
							description={<Title level={2}>{stats.inProgress}</Title>}
						/>
					</StyledCard>
				</Col>
			</Row>
		</div>
	);

	return (
		<StyledLayout>
			<StyledSider 
				width={250}
				collapsible 
				collapsed={collapsed} 
				onCollapse={setCollapsed}
			>
				<div style={{ height: 64, background: '#001529', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Title level={4} style={{ color: '#fff', margin: 0 }}>
						{collapsed ? 'S' : profile?.name || 'Student'}
					</Title>
				</div>
				<Menu
					mode="inline"
					selectedKeys={[getSelectedKey()]}
					style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
				>
					<Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => navigate(`/student-dashboard/${id}`)}>
						Dashboard
					</Menu.Item>
					<Menu.Item key="enrollments" icon={<BookOutlined />} onClick={() => navigate(`/student-dashboard/${id}/enrollments`)}>
						My Enrollments
					</Menu.Item>
					<Menu.Item key="courses" icon={<AppstoreOutlined />} onClick={() => navigate(`/student-dashboard/${id}/courses`)}>
						All Courses
					</Menu.Item>
					<Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate(`/student-dashboard/${id}/profile`)}>
						Update Profile
					</Menu.Item>
					<Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
						Logout
					</Menu.Item>
				</Menu>
			</StyledSider>
			<MainLayout collapsed={collapsed}>
				<ContentWrapper>
					<Routes>
						<Route index element={renderDashboardContent()} />
						<Route path="enrollments" element={<MyEnrollments onRefresh={refreshDashboard} />} />
						<Route path="courses" element={<AllCourses isStudent={true} onEnrollmentChange={refreshDashboard} />} />
						<Route path="profile" element={<ProfileUpdate />} />
					</Routes>
				</ContentWrapper>
			</MainLayout>
		</StyledLayout>
	);
};

export default StudentDashboard;