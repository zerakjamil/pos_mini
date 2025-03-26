// steps/BasicInfoStep.tsx
import React from 'react';
import { Form, Input, Button, Select, Space, Row, Col, Card } from 'antd';
import { TagOutlined, ShopOutlined, BarcodeOutlined } from '@ant-design/icons';
import { StepProps } from '../types';

const { Option } = Select;

const BasicInfoStep: React.FC<StepProps> = ({
    data,
    setData,
    errors = {}, // Add default value
    onNext = () => {}, // Add default function
    categories = [], // Add default empty array
    canProceed = true // Add default value
}) => {
  return (
    <Card className="shadow-sm">
      <Row gutter={16}>
        <Col xs={24} md={16}>
          <Form.Item
            label={<Space><TagOutlined /> Product Name</Space>}
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name}
            required
          >
            <Input
              placeholder="Enter product name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label={<Space><ShopOutlined /> Brand</Space>}
            validateStatus={errors.brand ? 'error' : ''}
            help={errors.brand}
          >
            <Input
              placeholder="Enter brand name"
              value={data.brand}
              onChange={(e) => setData('brand', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label={<Space><BarcodeOutlined /> Barcode</Space>}
            validateStatus={errors.barcode ? 'error' : ''}
            help={errors.barcode}
          >
            <Input
              placeholder="Scan or enter barcode"
              value={data.barcode}
              onChange={(e) => setData('barcode', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Category"
            validateStatus={errors.category_id ? 'error' : ''}
            help={errors.category_id}
            required
          >
            <Select
              placeholder="Select a category"
              value={data.category_id || undefined}
              onChange={(value) => setData('category_id', value)}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button
          type="primary"
          onClick={onNext}
          disabled={!canProceed}
          className="mt-4"
        >
          Next: Pricing
        </Button>
      </Form.Item>
    </Card>
  );
};

export default BasicInfoStep;
