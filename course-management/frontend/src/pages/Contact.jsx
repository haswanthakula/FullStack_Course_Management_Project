import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import emailjs from '@emailjs/browser';
import styled from 'styled-components';

const { Title } = Typography;

const PageContainer = styled.div`
	padding: 24px;
	max-width: 1200px;
	margin: 0 auto;
`;

const StyledCard = styled(Card)`
	background: #f0f2f5;
	max-width: 600px;
	margin: 24px auto;
`;

const Contact = () => {
	const [form] = Form.useForm();

	const sendEmail = (values) => {
		emailjs
			.send('service_w0brudi', 'template_u3iatzi', {
				user_name: values.name,
				user_email: values.email,
				message: values.message
			}, {
				publicKey: 'RwjP2wZEUkFove_K9',
			})
			.then(
				() => {
					message.success('Message sent successfully!');
					form.resetFields();
				},
				(error) => {
					message.error('Failed to send message');
					console.error('FAILED...', error.text);
				},
			);
	};

	return (
		<PageContainer>
			<Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
				Contact Us
			</Title>
			<StyledCard>
				<Form
					form={form}
					layout="vertical"
					onFinish={sendEmail}
				>
					<Form.Item
						name="name"
						label="Name"
						rules={[{ required: true, message: 'Please enter your name' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{ required: true, message: 'Please enter your email' },
							{ type: 'email', message: 'Please enter a valid email' }
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="message"
						label="Message"
						rules={[{ required: true, message: 'Please enter your message' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Send Message
						</Button>
					</Form.Item>
				</Form>
			</StyledCard>
		</PageContainer>
	);
};

export default Contact;