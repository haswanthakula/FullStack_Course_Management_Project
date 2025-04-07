import React, { useState } from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';


const { Header } = Layout;

const StyledHeader = styled(Header)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 50px;
	background: #fff;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Logo = styled(Link)`
	float: left;
	font-size: 20px;
	font-weight: bold;
	color: #1890ff;
	&:hover {
		color: #40a9ff;
	}
`;

const StyledMenu = styled(Menu)`
	flex: 1;
	justify-content: center;
	border-bottom: none;
`;

const ButtonGroup = styled.div`
	display: flex;
	gap: 16px;
`;

const MainNavbar = () => {
	const [isLoginVisible, setIsLoginVisible] = useState(false);
	const [isRegisterVisible, setIsRegisterVisible] = useState(false);
	const { user, logout } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();

	// Hide navbar in student and admin dashboards
	if (location.pathname.includes('/student-dashboard') || 
		location.pathname.includes('/admin-dashboard')) {
		return null;
	}

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const renderAuthButtons = () => {
		if (user) {
			return (
				<>
					<Button onClick={() => {
						if (user.role === 'ROLE_ADMIN') {
							navigate('/admin-dashboard');
						} else {
							navigate(`/student-dashboard/${user.id}`);
						}
					}}>
						Dashboard
					</Button>
					<Button onClick={handleLogout}>
						Logout
					</Button>
				</>
			);
		}

		return (
			<>
				<Button type="primary" onClick={() => setIsLoginVisible(true)}>
					Login
				</Button>
				<Button onClick={() => setIsRegisterVisible(true)}>
					Register
				</Button>

			</>
		);
	};

	return (
		<StyledHeader>
			<Logo to="/">ClickAcademy</Logo>
			
			<StyledMenu mode="horizontal" defaultSelectedKeys={['home']}>
				<Menu.Item key="home">
					<Link to="/">Home</Link>
				</Menu.Item>
				<Menu.Item key="about">
					<Link to="/about">About Us</Link>
				</Menu.Item>
				<Menu.Item key="courses">
					<Link to="/allcourses">All Courses</Link>
				</Menu.Item>
				<Menu.Item key="contact">
					<Link to="/contact">Contact Us</Link>
				</Menu.Item>
			</StyledMenu>

			<ButtonGroup>
				{renderAuthButtons()}
			</ButtonGroup>


			<Modal
				title="Login"
				visible={isLoginVisible}
				onCancel={() => setIsLoginVisible(false)}
				footer={null}
			>
				<LoginForm onClose={() => setIsLoginVisible(false)} />
			</Modal>

			<Modal
				title="Register"
				visible={isRegisterVisible}
				onCancel={() => setIsRegisterVisible(false)}
				footer={null}
			>
				<RegisterForm onClose={() => setIsRegisterVisible(false)} />
			</Modal>



		</StyledHeader>
	);
};

export default MainNavbar;