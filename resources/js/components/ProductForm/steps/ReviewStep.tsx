// steps/ReviewStep.tsx
import React from 'react';
import { Card, Button, Row, Col, Typography, Empty, Badge, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { StepProps } from '../types';

const { Title, Text } = Typography;

const ReviewStep: React.FC<StepProps> = ({
  data,
  errors,
  onPrevious,
  categories = [],
  imagePreviewUrl,
  formErrors = {},
  processing,
  onSubmit,
  resetForm,
  editMode = false
}) => {
  return (
    <Card className="shadow-sm">
      <div className="text-center mb-6">
        <Title level={4}>Product Summary</Title>
        <Text type="secondary">Review product details before submission</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            size="small"
            title="Basic Information"
            className="h-full"
          >
            <p><strong>Name:</strong> {data.name || 'Not specified'}</p>
            <p><strong>Brand:</strong> {data.brand || 'Not specified'}</p>
            <p><strong>Barcode:</strong> {data.barcode || 'Not specified'}</p>
            <p><strong>Category:</strong> {
              categories.find(c => c.id === data.category_id)?.name || 'Not selected'
            }</p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            size="small"
            title="Pricing"
            className="h-full"
          >
            <p><strong>Batch Price:</strong> {data.batch_price.toLocaleString()} IQD</p>
            <p><strong>Units Per Batch:</strong> {data.units_per_batch}</p>
            <p><strong>Unit Cost:</strong> {
              data.batch_price > 0 && data.units_per_batch > 0
                ? `${(data.batch_price / data.units_per_batch).toFixed(2)} IQD`
                : 'N/A'
            }</p>
            <p><strong>Selling Price:</strong> {data.price.toLocaleString()} IQD</p>
            <p><strong>Profit Per Unit:</strong> {
              data.batch_price > 0 && data.units_per_batch > 0
                ? `${(data.price - (data.batch_price / data.units_per_batch)).toFixed(2)} IQD`
                : 'N/A'
            }</p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            size="small"
            title="Inventory"
            className="h-full"
          >
            <p>
              <strong>Stock:</strong> {data.stock} {' '}
              {data.reorder_level && data.stock <= data.reorder_level && (
                <Badge status="warning" text="Low Stock" />
              )}
            </p>
            <p><strong>Reorder Level:</strong> {data.reorder_level}</p>
            <p><strong>Expiration Date:</strong> {
              data.expiration_date
                ? data.expiration_date.format('MMMM D, YYYY')
                : 'No expiration date'
            }</p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            size="small"
            title="Image"
            className="h-full text-center"
          >
            {imagePreviewUrl ? (
              <div style={{ height: '100px' }}>
                <img
                  src={imagePreviewUrl}
                  alt="Product"
                  className="max-h-full max-w-full object-contain mx-auto"
                />
              </div>
            ) : (
              <Empty description="No image" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      {Object.keys(formErrors).length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <Text type="danger">Please fix the errors before submitting the form.</Text>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button onClick={onPrevious}>
          Previous
        </Button>
        <Space>
          <Button onClick={resetForm}>Reset Form</Button>
          <Button
            type="primary"
            onClick={onSubmit}
            loading={processing}
            icon={<SaveOutlined />}
          >
            {editMode ? 'Update Product' : 'Save Product'}
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default ReviewStep;
