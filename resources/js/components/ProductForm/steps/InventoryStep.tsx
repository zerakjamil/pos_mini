// steps/InventoryStep.tsx
import React from 'react';
import { Form, InputNumber, Button, Space, Card, DatePicker, Tooltip, Row, Col } from 'antd';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { StepProps } from '../types';

const InventoryStep: React.FC<StepProps> = ({
  data,
  setData,
  errors,
  onNext,
  onPrevious
}) => {
  return (
    <Card className="shadow-sm">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Current Stock"
            validateStatus={errors.stock ? 'error' : ''}
            help={errors.stock}
            required
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Current quantity"
              value={data.stock}
              onChange={(value) => setData('stock', value ?? 0)}
              min={0}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label={
              <Space>
                Reorder Level
                <Tooltip title="Minimum stock level before reordering">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            }
            validateStatus={errors.reorder_level ? 'error' : ''}
            help={errors.reorder_level}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Reorder threshold"
              value={data.reorder_level}
              onChange={(value) => setData('reorder_level', value ?? 5)}
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label={<Space><CalendarOutlined /> Expiration Date</Space>}
        validateStatus={errors.expiration_date ? 'error' : ''}
        help={errors.expiration_date}
      >
        <DatePicker
          style={{ width: '100%' }}
          placeholder="Select expiration date"
          value={data.expiration_date || null}
          onChange={(date) => setData('expiration_date', date)}
          disabledDate={(current) => current && current < dayjs().endOf('day')}
        />
      </Form.Item>

      <div className="flex justify-between mt-4">
        <Button onClick={onPrevious}>
          Previous
        </Button>
        <Button
          type="primary"
          onClick={onNext}
        >
          Next: Image
        </Button>
      </div>
    </Card>
  );
};

export default InventoryStep;
