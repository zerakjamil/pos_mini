// steps/PricingStep.tsx
import React from 'react';
import { Form, InputNumber, Button, Space, Card, Typography, Tooltip } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { StepProps } from '../types';

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
  return (
    <Card className="shadow-sm">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <Text type="secondary">
          The unit price will be calculated automatically based on the batch price and units per batch.
        </Text>
      </div>

      <Form.Item
        label={<Space><DollarOutlined /> Batch Price</Space>}
        validateStatus={errors.batch_price ? 'error' : ''}
        help={errors.batch_price}
        required
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="Enter batch price"
          value={data.batch_price}
          onChange={(value) => setData('batch_price', value ?? 0)}
          min={0}
          addonBefore="IQD"
        />
      </Form.Item>

      <Form.Item
        label="Units Per Batch"
        validateStatus={errors.units_per_batch ? 'error' : ''}
        help={errors.units_per_batch}
        required
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="Number of units"
          value={data.units_per_batch}
          onChange={(value) => setData('units_per_batch', value ?? 1)}
          min={1}
        />
      </Form.Item>

      <Form.Item
        label="Unit Selling Price"
        validateStatus={errors.price ? 'error' : ''}
        help={errors.price}
        required
      >
        <div className="flex items-center">
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter selling price per unit"
            value={data.price}
            onChange={(value) => setData('price', value ?? 0)}
            min={0}
            addonBefore="IQD"
          />

          {calculatedUnitPrice && (
            <Tooltip title="Suggested price based on batch cost">
              <Button
                type="link"
                onClick={() => setData('price', calculatedUnitPrice)}
              >
                Suggested: {calculatedUnitPrice.toLocaleString()} IQD
              </Button>
            </Tooltip>
          )}
        </div>
      </Form.Item>

      <div className="flex justify-between mt-4">
        <Button onClick={onPrevious}>
          Previous
        </Button>
        <Button
          type="primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          Next: Inventory
        </Button>
      </div>
    </Card>
  );
};

export default PricingStep;
