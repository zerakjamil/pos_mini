// steps/ReviewStep.tsx
import React from 'react';
import { Card, Button, Row, Col, Typography, Empty, Badge, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { StepProps } from '../types';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Card className="shadow-sm" dir={'rtl'}>
      <div className="text-center mb-6">
        <Title level={4}>{t('products.reviewStep.productSummary')}</Title>
        <Text type="secondary">{t('products.reviewStep.reviewDetails')}</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            size="small"
            title={t('products.reviewStep.basicInformation')}
            className="h-full"
          >
            <p><strong>{t('products.reviewStep.name')}:</strong> {data.name || t('common.notSpecified')}</p>
            <p><strong>{t('products.reviewStep.brand')}:</strong> {data.brand || t('common.notSpecified')}</p>
            <p><strong>{t('products.reviewStep.barcode')}:</strong> {data.barcode || t('common.notSpecified')}</p>
            <p><strong>{t('products.reviewStep.category')}:</strong> {
              categories.find(c => c.id === data.category_id)?.name || t('products.reviewStep.notSelected')
            }</p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            size="small"
            title={t('products.reviewStep.pricing')}
            className="h-full"
          >
            <p><strong>{t('products.reviewStep.batchPrice')}:</strong> {data.batch_price.toLocaleString()} {t('common.currency')}</p>
            <p><strong>{t('products.reviewStep.unitsPerBatch')}:</strong> {data.units_per_batch}</p>
            <p><strong>{t('products.reviewStep.unitCost')}:</strong> {
              data.batch_price > 0 && data.units_per_batch > 0
                ? `${(data.batch_price / data.units_per_batch).toFixed(2)} ${t('common.currency')}`
                : t('common.notApplicable')
            }</p>
            <p><strong>{t('products.reviewStep.sellingPrice')}:</strong> {data.price.toLocaleString()} {t('common.currency')}</p>
            <p><strong>{t('products.reviewStep.profitPerUnit')}:</strong> {
              data.batch_price > 0 && data.units_per_batch > 0
                ? `${(data.price - (data.batch_price / data.units_per_batch)).toFixed(2)} ${t('common.currency')}`
                : t('common.notApplicable')
            }</p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            size="small"
            title={t('products.reviewStep.inventory')}
            className="h-full"
          >
            <p>
              <strong>{t('products.reviewStep.stock')}:</strong> {data.stock} {' '}
              {data.reorder_level && data.stock <= data.reorder_level && (
                <Badge status="warning" text={t('products.reviewStep.lowStock')} />
              )}
            </p>
            <p><strong>{t('products.reviewStep.reorderLevel')}:</strong> {data.reorder_level}</p>
            <p><strong>{t('products.reviewStep.expirationDate')}:</strong> {
              data.expiration_date
                ? data.expiration_date.format('MMMM D, YYYY')
                : t('products.reviewStep.noExpirationDate')
            }</p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            size="small"
            title={t('products.reviewStep.image')}
            className="h-full text-center"
          >
            {imagePreviewUrl ? (
              <div style={{ height: '100px' }}>
                <img
                  src={imagePreviewUrl}
                  alt={t('products.reviewStep.productImage')}
                  className="max-h-full max-w-full object-contain mx-auto"
                />
              </div>
            ) : (
              <Empty description={t('products.reviewStep.noImage')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      {Object.keys(formErrors).length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <Text type="danger">{t('products.reviewStep.fixErrors')}</Text>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button onClick={onPrevious}>
          {t('common.previous')}
        </Button>
        <Space>
          <Button onClick={resetForm}>{t('products.reviewStep.resetForm')}</Button>
          <Button
            type="primary"
            onClick={onSubmit}
            loading={processing}
            icon={<SaveOutlined />}
          >
            {editMode ? t('products.reviewStep.updateProduct') : t('products.reviewStep.saveProduct')}
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default ReviewStep;
