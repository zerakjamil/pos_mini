// steps/PricingStep.tsx
import React from 'react';
import { Form, InputNumber, Button, Space, Card, Typography, Tooltip } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { StepProps } from '../types';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const PricingStep: React.FC<StepProps> = ({
  data,
  setData,
  errors,
  onNext,
  onPrevious,
  canProceed,
  calculatedUnitPrice
}) => {
  const { t } = useTranslation();

  return (
    <Card className="shadow-sm">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <Text type="secondary">
          {t('products.pricingStep.unitPriceInfo')}
        </Text>
      </div>

      <Form.Item
        label={<Space><DollarOutlined /> {t('products.pricingStep.batchPrice')}</Space>}
        validateStatus={errors.batch_price ? 'error' : ''}
        help={errors.batch_price}
        required
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder={t('products.pricingStep.enterBatchPrice')}
          value={data.batch_price}
          onChange={(value) => setData('batch_price', value ?? 0)}
          min={0}
          addonBefore={t('common.currency')}
        />
      </Form.Item>

      <Form.Item
        label={t('products.pricingStep.unitsPerBatch')}
        validateStatus={errors.units_per_batch ? 'error' : ''}
        help={errors.units_per_batch}
        required
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder={t('products.pricingStep.numberOfUnits')}
          value={data.units_per_batch}
          onChange={(value) => setData('units_per_batch', value ?? 1)}
          min={1}
        />
      </Form.Item>

      <Form.Item
        label={t('products.pricingStep.unitSellingPrice')}
        validateStatus={errors.price ? 'error' : ''}
        help={errors.price}
        required
      >
        <div className="flex items-center">
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('products.pricingStep.enterSellingPricePerUnit')}
            value={data.price}
            onChange={(value) => setData('price', value ?? 0)}
            min={0}
            addonBefore={t('common.currency')}
          />

          {calculatedUnitPrice && (
            <Tooltip title={t('products.pricingStep.suggestedPriceTooltip')}>
              <Button
                type="link"
                onClick={() => setData('price', calculatedUnitPrice)}
              >
                {t('products.pricingStep.suggested')}: {calculatedUnitPrice.toLocaleString()} {t('common.currency')}
              </Button>
            </Tooltip>
          )}
        </div>
      </Form.Item>

      <div className="flex justify-between mt-4">
        <Button onClick={onPrevious}>
          {t('common.previous')}
        </Button>
        <Button
          type="primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          {t('products.pricingStep.nextInventory')}
        </Button>
      </div>
    </Card>
  );
};

export default PricingStep;
