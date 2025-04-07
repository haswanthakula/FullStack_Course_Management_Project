import React from 'react';
import { Row, Col, Card, Typography, Space } from 'antd';
import { BookOutlined, TeamOutlined, TrophyOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const StyledSection = styled.div`
	padding: 48px 24px;
	background: ${props => props.background || '#fff'};
`;

const FeatureCard = styled(Card)`
	text-align: center;
	height: 100%;
	.anticon {
		font-size: 32px;
		color: #1890ff;
		margin-bottom: 16px;
	}
`;

const About = () => {
	const features = [
		{
			icon: <BookOutlined />,
			title: 'Quality Education',
			description: 'Access to high-quality courses designed by industry experts'
		},
		{
			icon: <TeamOutlined />,
			title: 'Expert Instructors',
			description: 'Learn from experienced professionals in their respective fields'
		},
		{
			icon: <TrophyOutlined />,
			title: 'Achievement Recognition',
			description: 'Earn certificates upon successful course completion'
		},
		{
			icon: <SafetyCertificateOutlined />,
			title: 'Verified Content',
			description: 'All courses are verified for quality and relevance'
		}
	];

	return (
		<div>
			<StyledSection background="#f0f2f5">
				<Row justify="center">
					<Col xs={24} md={16} lg={12}>
						<Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
							<Title level={1}>About Us</Title>
							<Paragraph>
								Welcome to Course Management, your premier destination for online learning and professional development. 
								We are committed to providing high-quality education that helps students achieve their goals and advance their careers.
							</Paragraph>
						</Space>
					</Col>
				</Row>
			</StyledSection>

			<StyledSection>
				<Row gutter={[32, 32]}>
					{features.map((feature, index) => (
						<Col xs={24} sm={12} md={6} key={index}>
							<FeatureCard>
								{feature.icon}
								<Title level={4}>{feature.title}</Title>
								<Paragraph>{feature.description}</Paragraph>
							</FeatureCard>
						</Col>
					))}
				</Row>
			</StyledSection>

			<StyledSection background="#f0f2f5">
				<Row justify="center">
					<Col xs={24} md={16}>
						<Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Our Mission</Title>
						<Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
							Our mission is to empower individuals with knowledge and skills through accessible, 
							high-quality online education. We believe in creating an engaging learning environment 
							that promotes personal growth and professional development. Through our platform, 
							we aim to bridge the gap between traditional education and industry requirements, 
							preparing our students for success in their chosen fields.
						</Paragraph>
					</Col>
				</Row>
			</StyledSection>

			<StyledSection>
				<Row justify="center">
					<Col xs={24} md={16}>
						<Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Why Choose Us</Title>
						<Row gutter={[32, 32]}>
							<Col xs={24} md={8}>
								<Title level={4}>Flexible Learning</Title>
								<Paragraph>
									Study at your own pace with our flexible course schedules and accessible online platform.
								</Paragraph>
							</Col>
							<Col xs={24} md={8}>
								<Title level={4}>Industry Relevance</Title>
								<Paragraph>
									Courses designed to meet current industry demands and future trends.
								</Paragraph>
							</Col>
							<Col xs={24} md={8}>
								<Title level={4}>Support System</Title>
								<Paragraph>
									Dedicated support team to help you throughout your learning journey.
								</Paragraph>
							</Col>
						</Row>
					</Col>
				</Row>
			</StyledSection>
		</div>
	);
};

export default About;