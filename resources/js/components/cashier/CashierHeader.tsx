import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title, Text } = Typography;

const CashierHeader: React.FC = () => {
  return (
    <Header style={{ background: '#fff', padding: '0 20px' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: '16px 0' }}>
            <ShoppingCartOutlined /> POS Cashier System
          </Title>
        </Col>
        <Col>
          <Space>
            <Text>Cashier: John Doe</Text>
            <Text>Terminal: #1</Text>
            <Text>Date: {new Date().toLocaleDateString()}</Text>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default CashierHeader;
