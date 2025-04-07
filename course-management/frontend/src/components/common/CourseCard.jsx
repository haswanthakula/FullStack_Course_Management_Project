import React, { useState } from 'react';
import { Card, Button, Tag, Modal, Space, Typography, message } from 'antd';
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
	'https://images.unsplash.com/photo-1501504905252-473c47e087f8', // library
	

];

const getImageUrl = (courseId) => {
	// Use a hash function to get better distribution
	const hash = courseId.split('').reduce((acc, char) => {
		return char.charCodeAt(0) + ((acc << 5) - acc);
	}, 0);
	const index = Math.abs(hash) % courseImages.length;
	return `${courseImages[index]}?auto=format&fit=crop&w=300&h=200`;
};

const StyledCard = styled(Card)`
	width: 100%;
	margin-bottom: 16px;
	.ant-card-meta-title {
		margin-bottom: 12px;
	}
	.ant-card-cover img {
		height: 200px;
		object-fit: cover;
	}
`;

const PriceTag = styled.div`
	font-size: 18px;
	color: #1890ff;
	margin: 8px 0;
`;

const CourseCard = ({ course, isAuthenticated, isEnrolled, onEnroll }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => setIsModalVisible(true);
	const handleCancel = () => setIsModalVisible(false);

	const handleEnrollClick = () => {
		if (!isAuthenticated) {
			message.warning('Please login to enroll in courses');
			return;
		}
		onEnroll(course.id);
	};

	const enrollButtonText = isEnrolled ? 'Unenroll' : 'Enroll Now';
	const enrollButtonType = isEnrolled ? 'danger' : 'primary';

	return (
		<>
			<StyledCard
				hoverable
				cover={<img alt={course.title} src={getImageUrl(course.id)} />}
				actions={[
					<Button type="primary" onClick={showModal}>View Details</Button>,
					isAuthenticated && (
						<Button type={enrollButtonType} onClick={handleEnrollClick}>
							{enrollButtonText}
						</Button>
					)
				].filter(Boolean)} // Filter out false values
			>
				<Card.Meta
					title={<Title level={4}>{course.title}</Title>}
					description={
						<>
							<PriceTag>${course.price}</PriceTag>
							<Space>
								<Tag color="blue">{course.level}</Tag>
								<Tag color="green">{course.language}</Tag>
								<Tag color="purple">{course.category}</Tag>
							</Space>
						</>
					}
				/>
			</StyledCard>

			<Modal
				title={course.title}
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>Close</Button>,
					isAuthenticated && (
						<Button 
							key="enroll" 
							type={enrollButtonType}
							onClick={() => {
								handleEnrollClick();
								handleCancel();
							}}
						>
							{enrollButtonText}
						</Button>
					)
				].filter(Boolean)} // Filter out false values
				width={600}
			>
				<div style={{ marginBottom: '16px' }}>
					<img 
						src={getImageUrl(course.id).replace('w=300&h=200', 'w=600&h=300')} 
						alt={course.title} 
						style={{ width: '100%', borderRadius: '8px' }}
					/>
				</div>
				<p><strong>Instructor:</strong> {course.instructor}</p>
				<p><strong>Category:</strong> {course.category}</p>
				<p><strong>Level:</strong> {course.level}</p>
				<p><strong>Language:</strong> {course.language}</p>
				<p><strong>Price:</strong> ${course.price}</p>
				<p><strong>Enrollment Limit:</strong> {course.enrollmentLimit} students</p>
				<p><strong>Description:</strong> {course.description}</p>
			</Modal>
		</>
	);
};

export default CourseCard;