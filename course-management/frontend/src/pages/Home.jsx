import React, { useState, useEffect } from 'react';
import { Carousel, Row, Col, Card, Button } from 'antd';
import styled from 'styled-components';
import CourseCard from '../components/common/CourseCard';
import courseService from '../services/courseService';

const CarouselWrapper = styled.div`
	margin-bottom: 48px;
	.ant-carousel .slick-slide {
		height: 800px;
		line-height: 400px;
		text-align: center;
		background: #f5f6f8;
		overflow: hidden;
	}
`;

const SectionTitle = styled.h2`
	text-align: center;
	margin: 48px 0 24px;
	font-size: 32px;
	color: #1890ff;
`;

const PricingCard = styled(Card)`
	background: #f0f2f5;
	text-align: center;
	height: 100%;
	.ant-card-head-title {
		font-size: 24px;
		color: #1890ff;
	}
`;

const Home = () => {
	const [topCourses, setTopCourses] = useState([]);

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			const courses = await courseService.getAllCourses();
			// Get the first 4 courses as top courses
			setTopCourses(courses.slice(0, 4));
		} catch (error) {
			console.error('Error fetching courses:', error);
		}
	};



	const carouselItems = [
		{
			title: 'Learn at Your Own Pace',
			description: 'Access courses anytime, anywhere',
			image: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		},
		{
			title: 'Expert Instructors',
			description: 'Learn from industry professionals',
			image: 'https://images.unsplash.com/photo-1521737451536-00a86f630f3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		},
		{
			title: 'Wide Range of Courses',
			description: 'Find the perfect course for you',
			image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		},
		{
			title: 'Interactive Learning',
			description: 'Engage with course materials',
			image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		},
		{
			title: 'Certificate of Completion',
			description: 'Earn certificates for your achievements',
			image: 'https://images.unsplash.com/photo-1520881363902-a0ff4e722963?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		}
	];

	const pricingPlans = [
		{
			title: 'Basic',
			price: '$9.99/month',
			features: [
				'Access to 100+ courses',
				'Basic support',
				'Course completion certificates',
				'Mobile access',
				'Group Discussions'
			]
		},
		{
			title: 'Premium',
			price: '$19.99/month',
			features: [
				'Access to all courses',
				'Priority support',
				'Downloadable resources',
				'Offline access',
				'Group sessions'
			]
		},
		{
			title: 'Enterprise',
			price: '$49.99/month',
			features: [
				'All Premium features',
				'24/7 support',
				'Custom learning paths',
				'Team management',
				'Analytics dashboard'
			]
		}
	];

	return (
		<div>
			<CarouselWrapper>
				<Carousel autoplay effecct="fade">
					{carouselItems.map((item, index) => (
						<div key={index}>
							<div style={{
								height: 800,
								background: `url(${item.image}) center/cover no-repeat`,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								color: '#fff',
								textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
							}}>
								<h2 style={{ fontSize: '46px', margin: 0 , color: '#fff'}}>{item.title}</h2>
								<p style={{ fontSize: '24px' }}>{item.description}</p>
							</div>
						</div>
					))}
				</Carousel>
			</CarouselWrapper>

			<div style={{ padding: '0 48px' }}>
				<SectionTitle>Explore Courses</SectionTitle>
				<Row gutter={[16, 16]}>
					{topCourses.map(course => (
						<Col xs={24} sm={12} md={6} key={course.id}>
							<CourseCard course={course} />
						</Col>
					))}
				</Row>

				<SectionTitle>Pricing Plans</SectionTitle>

				<Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
					{pricingPlans.map((plan, index) => (
						<Col xs={24} md={8} key={index}>
							<PricingCard
								title={plan.title}
								bordered={false}
								hoverable
							>
								<h3 style={{ fontSize: '28px', margin: '16px 0' }}>{plan.price}</h3>
								<ul style={{ listStyle: 'none', padding: 0 }}>
									{plan.features.map((feature, idx) => (
										<li key={idx} style={{ margin: '8px 0' }}>{feature}</li>
									))}
								</ul>
								<Button type="primary" size="medium">
									Comming Soon...
								</Button>
							</PricingCard>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
};

export default Home;