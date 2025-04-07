import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Slider, message, Space, Typography } from 'antd';
import styled from 'styled-components';
import CourseCard from '../components/common/CourseCard';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const FilterContainer = styled.div`
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	padding: 24px;
	margin-bottom: 24px;
`;

const PageHeader = styled.div`
	margin-bottom: 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const CoursesContainer = styled.div`
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	padding: 24px;
`;

const AllCourses = ({ isStudent = false, onEnrollmentChange }) => {
	const [courses, setCourses] = useState([]);
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		category: '',
		level: '',
		language: '',
		maxPrice: 1000,
		search: ''
	});
	const { user } = useAuth();

	useEffect(() => {
		fetchCourses();
		if (isStudent && user) {
			fetchEnrolledCourses();
		}
	}, [filters, user]);

	const fetchEnrolledCourses = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(
				`http://localhost:8080/api/enrollments/student/${user.id}`,
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);
			setEnrolledCourses(response.data);
		} catch (error) {
			console.error('Error fetching enrollments:', error);
		}
	};

	const fetchCourses = async () => {
		try {
			setLoading(true);
			const response = await axios.get('http://localhost:8080/api/courses', {
				params: filters
			});
			setCourses(response.data);
		} catch (error) {
			message.error('Failed to fetch courses');
		} finally {
			setLoading(false);
		}
	};

	const handleEnroll = async (courseId) => {
		if (!user) {
			message.warning('Please login to enroll in courses');
			return;
		}

		const token = localStorage.getItem('token');
		const isEnrolled = enrolledCourses.some(enrollment => enrollment.course.id === courseId);

		try {
			if (isEnrolled) {
				const enrollment = enrolledCourses.find(e => e.course.id === courseId);
				await axios.delete(
					`http://localhost:8080/api/enrollments/${enrollment.id}`,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				);
				message.success('Successfully unenrolled from course');
			} else {
				await axios.post(
					`http://localhost:8080/api/enrollments/${courseId}`,
					{},
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				);
				message.success('Successfully enrolled in course');
			}
			fetchEnrolledCourses();
			if (onEnrollmentChange) {
				onEnrollmentChange();
			}
		} catch (error) {
			console.error('Enrollment error:', error);
			message.error(isEnrolled ? 'Failed to unenroll from course' : 'Failed to enroll in course');
		}
	};



	const handleFilterChange = (value, type) => {
		setFilters(prev => ({ ...prev, [type]: value }));
	};

	return (
		<>

			<FilterContainer>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={6}>
						<Search
							placeholder="Search courses"
							onChange={e => handleFilterChange(e.target.value, 'search')}
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							style={{ width: '100%' }}
							placeholder="Select Category"
							onChange={value => handleFilterChange(value, 'category')}
						>
							<Option value="">All Categories</Option>
							<Option value="programming">Programming</Option>
							<Option value="design">Design</Option>
							<Option value="Cloud Computing">Cloud Computing</Option>
							<Option value="Web Development">Web Development</Option>
							<Option value="Blockchain">Block Chain</Option>
							<Option value="Database">Data Base</Option>

						</Select>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							style={{ width: '100%' }}
							placeholder="Select Level"
							onChange={value => handleFilterChange(value, 'level')}
						>
							<Option value="">All Levels</Option>
							<Option value="beginner">Beginner</Option>
							<Option value="intermediate">Intermediate</Option>
							<Option value="advanced">Advanced</Option>
						</Select>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							style={{ width: '100%' }}
							placeholder="Select Language"
							onChange={value => handleFilterChange(value, 'language')}
						>
							<Option value="">All Languages</Option>
							<Option value="english">English</Option>
							<Option value="spanish">Spanish</Option>
							<Option value="german">German</Option>

						</Select>
					</Col>
					<Col span={24}>
						<Space direction="vertical" style={{ width: '100%' }}>
							<span>Price Range: ${filters.maxPrice}</span>
							<Slider
								min={0}
								max={1000}
								value={filters.maxPrice}
								onChange={value => handleFilterChange(value, 'maxPrice')}
							/>
						</Space>
					</Col>
				</Row>
			</FilterContainer>

			<CoursesContainer>
				<Row gutter={[16, 16]}>
					{courses.map(course => (
						<Col xs={24} sm={12} md={8} lg={6} key={course.id}>
							<CourseCard 
								course={course}
								isAuthenticated={isStudent || (user && user.role === 'ROLE_STUDENT')}
								isEnrolled={enrolledCourses.some(enrollment => enrollment.course.id === course.id)}
								onEnroll={() => handleEnroll(course.id)}
							/>
						</Col>
					))}
				</Row>
			</CoursesContainer>
		</>
	);

};

export default AllCourses;