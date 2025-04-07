import React from 'react';
import { Layout, Row, Col, Space } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const { Footer: AntFooter } = Layout;

const StyledFooter = styled(AntFooter)`
	background: #001529;
	color: #fff;
	padding: 40px 0;
`;

const FooterSection = styled.div`
	margin-bottom: 20px;
	margin-left: 70px;
`;

const FooterTitle = styled.h3`
	color: #fff;
	margin-bottom: 16px;
`;

const FooterLink = styled.a`
	color: #fff;
	opacity: 0.8;
	&:hover {
		opacity: 1;
		color: #1890ff;
	}
`;

const SocialIcon = styled.a`
	color: #fff;
	font-size: 24px;
	margin: 0 12px;
	opacity: 0.8;
	&:hover {
		opacity: 1;
		color: #1890ff;
	}
`;

const Footer = () => {
	const location = useLocation();

	// Hide footer in student and admin dashboards
	if (location.pathname.includes('/student-dashboard') || 
		location.pathname.includes('/admin-dashboard')) {
		return null;
	}

	return (
		<StyledFooter>
			<Row justify="center" gutter={[32, 32]}>
				<Col xs={24} sm={12} md={8}>
					<FooterSection>
						<FooterTitle>About Us</FooterTitle>
						<p>We provide high-quality online courses to help you advance in your career and personal development.</p>
					</FooterSection>
				</Col>
				
				<Col xs={24} sm={12} md={8}>
					<FooterSection>
						<FooterTitle>Quick Links</FooterTitle>
						<Space direction="vertical">
							<FooterLink href="/about">About Us</FooterLink>
							<FooterLink href="/allcourses">Courses</FooterLink>
						</Space>
					</FooterSection>
				</Col>
				
				<Col xs={24} sm={12} md={8}>
					<FooterSection>
						<FooterTitle>Contact Info</FooterTitle>
						<Space direction="vertical">
							<div>Email: info@clickacademy.com</div>
							<div>Phone: +0 123 456 7890</div>
							<div>Address: 123 clickacademy St, Learning City</div>
						</Space>
					</FooterSection>
				</Col>
			</Row>

			<Row justify="center" style={{ marginTop: '24px' }}>
				<Col>
					<Space>
						<SocialIcon href="https://facebook.com" target="_blank">
							<FacebookOutlined />
						</SocialIcon>
						<SocialIcon href="https://twitter.com" target="_blank">
							<TwitterOutlined />
						</SocialIcon>
						<SocialIcon href="https://instagram.com" target="_blank">
							<InstagramOutlined />
						</SocialIcon>
						<SocialIcon href="https://linkedin.com" target="_blank">
							<LinkedinOutlined />
						</SocialIcon>
					</Space>
				</Col>
			</Row>

			<Row justify="center" style={{ marginTop: '24px' }}>
				<Col>
					<div>© {new Date().getFullYear()} Course Management. All rights reserved.</div>
				</Col>
			</Row>
		</StyledFooter>
	);
};

export default Footer;