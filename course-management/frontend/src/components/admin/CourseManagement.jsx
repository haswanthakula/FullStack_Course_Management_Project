import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Row, Col } from 'antd';
import styled from 'styled-components';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

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

const CourseManagement = () => {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingCourse, setEditingCourse] = useState(null);
	const [form] = Form.useForm();

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:8080/api/admin/courses', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setCourses(response.data);
		} catch (error) {
			message.error('Failed to fetch courses');
		} finally {
			setLoading(false);
		}
	};

	const handleAddEdit = async (values) => {
		try {
			const token = localStorage.getItem('token');
			if (editingCourse) {
				await axios.put(`http://localhost:8080/api/admin/courses/${editingCourse.id}`, values, {
					headers: { Authorization: `Bearer ${token}` }
				});
				message.success('Course updated successfully');
			} else {
				await axios.post('http://localhost:8080/api/admin/courses', values, {
					headers: { Authorization: `Bearer ${token}` }
				});
				message.success('Course created successfully');
			}
			setIsModalVisible(false);
			form.resetFields();
			fetchCourses();
		} catch (error) {
			message.error('Operation failed');
		}
	};

	const handleDelete = async (id) => {
		try {
			const token = localStorage.getItem('token');
			await axios.delete(`http://localhost:8080/api/admin/courses/${id}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			message.success('Course deleted successfully');
			fetchCourses();
		} catch (error) {
			message.error('Failed to delete course');
		}
	};

	const columns = [
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
			title: 'Level',
			dataIndex: 'level',
			key: 'level',
		},
		{
			title: 'Language',
			dataIndex: 'language',
			key: 'language',
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
					<Button 
						type="link" 
						onClick={() => {
							setEditingCourse(record);
							form.setFieldsValue(record);
							setIsModalVisible(true);
						}}
					>
						Edit
					</Button>
					<Button type="link" danger onClick={() => handleDelete(record.id)}>
						Delete
					</Button>
				</>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Button 
				type="primary" 
				onClick={() => {
					setEditingCourse(null);
					form.resetFields();
					setIsModalVisible(true);
				}}
				style={{ marginBottom: 16 }}
			>
				Add New Course
			</Button>

			<StyledTable
				loading={loading}
				columns={columns}
				dataSource={courses}
				rowKey="id"
			/>

			<Modal
				title={editingCourse ? 'Edit Course' : 'Add New Course'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				width={700}
				footer={null}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleAddEdit}
				>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="title"
								label="Title"
								rules={[{ required: true, message: 'Please input course title!' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="instructor"
								label="Instructor"
								rules={[{ required: true, message: 'Please input instructor name!' }]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						name="description"
						label="Description"
						rules={[{ required: true, message: 'Please input course description!' }]}
					>
						<TextArea rows={4} />
					</Form.Item>

					<Row gutter={16}>
						<Col span={8}>
							<Form.Item
								name="category"
								label="Category"
								rules={[{ required: true, message: 'Please select category!' }]}
							>
								<Select>
									<Option value="programming">Programming</Option>
									<Option value="design">Design</Option>
									<Option value="business">Business</Option>
									<Option value="marketing">Marketing</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="level"
								label="Level"
								rules={[{ required: true, message: 'Please select level!' }]}
							>
								<Select>
									<Option value="beginner">Beginner</Option>
									<Option value="intermediate">Intermediate</Option>
									<Option value="advanced">Advanced</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="language"
								label="Language"
								rules={[{ required: true, message: 'Please select language!' }]}
							>
								<Select>
									<Option value="english">English</Option>
									<Option value="spanish">Spanish</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="price"
								label="Price"
								rules={[{ required: true, message: 'Please input price!' }]}
							>
								<InputNumber
									min={0}
									precision={2}
									style={{ width: '100%' }}
									formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={value => value.replace(/\$\s?|(,*)/g, '')}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="enrollmentLimit"
								label="Enrollment Limit"
								rules={[{ required: true, message: 'Please input enrollment limit!' }]}
							>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							{editingCourse ? 'Update Course' : 'Create Course'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default CourseManagement;