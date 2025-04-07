import React from 'react';
import { BackTop } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledBackTop = styled(BackTop)`
	.ant-back-top-content {
		background-color: #1890ff;
		opacity: 0.8;
		transition: all 0.3s;
		&:hover {
			opacity: 1;
		}
	}
`;

const BackToTopButton = () => {
	return (
		<StyledBackTop>
			<div style={{
				height: 40,
				width: 40,
				lineHeight: '40px',
				borderRadius: 4,
				backgroundColor: '#1890ff',
				color: '#fff',
				textAlign: 'center',
				fontSize: 14
			}}>
				<UpOutlined />
			</div>
		</StyledBackTop>
	);
};

export default BackToTopButton;