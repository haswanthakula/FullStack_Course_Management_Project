import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button } from 'antd';

const CourseForm = ({ initialValues, onFinish, form }) => {
	useEffect(() => {
		if (initialValues) {
			// Remove timestamps from form data
			const formData = { ...initialValues };
			delete formData.createdAt;
			delete formData.updatedAt;
			form.setFieldsValue(formData);
		} else {
			form.resetFields();
		}
	}, [initialValues, form]);

	return (
		<Form
			form={form}
			layout="vertical"
			onFinish={(values) => {
				// Ensure all number fields are properly typed
				const formattedValues = {
					...values,
					price: parseFloat(values.price),
					enrollmentLimit: parseInt(values.enrollmentLimit, 10)
				};
				onFinish(formattedValues);
			}}
		>
			<Form.Item
				name="title"
				label="Title"
				rules={[{ required: true, message: 'Please input course title!' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				name="instructor"
				label="Instructor"
				rules={[{ required: true, message: 'Please input instructor name!' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				name="description"
				label="Description"
				rules={[{ required: true, message: 'Please input course description!' }]}
			>
				<Input.TextArea rows={4} />
			</Form.Item>

			<Form.Item
				name="category"
				label="Category"
				rules={[{ required: true, message: 'Please select category!' }]}
			>
				<Select>
					<Select.Option value="programming">Programming</Select.Option>
					<Select.Option value="design">Design</Select.Option>
					<Select.Option value="Cloud Computing">Cloud Computing</Select.Option>
					<Select.Option value="Web Development">Web Development</Select.Option>
					<Select.Option value="Blockchain">Block Chain</Select.Option>
					<Select.Option value="Database">Data Base</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item
				name="level"
				label="Level"
				rules={[{ required: true, message: 'Please select level!' }]}
			>
				<Select>
					<Select.Option value="beginner">Beginner</Select.Option>
					<Select.Option value="intermediate">Intermediate</Select.Option>
					<Select.Option value="advanced">Advanced</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item
				name="language"
				label="Language"
				rules={[{ required: true, message: 'Please select language!' }]}
			>
				<Select>
					<Select.Option value="english">English</Select.Option>
					<Select.Option value="spanish">Spanish</Select.Option>
					<Select.Option value="german">Germany</Select.Option>
					
				</Select>
			</Form.Item>

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

			<Form.Item
				name="enrollmentLimit"
				label="Enrollment Limit"
				rules={[{ required: true, message: 'Please input enrollment limit!' }]}
			>
				<InputNumber min={1} style={{ width: '100%' }} />
			</Form.Item>
		</Form>
	);
};

export default CourseForm;