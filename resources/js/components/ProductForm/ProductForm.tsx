// ProductForm.tsx
import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, Steps, Divider, Spin, Typography } from 'antd';
import {
  InfoCircleOutlined, DollarOutlined, BoxPlotOutlined,
  CloudUploadOutlined, SaveOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { ProductFormProps } from './types';
import { useProductForm } from './hooks/useProductForm';
import { useImageUpload } from './hooks/useImageUpload';
import BasicInfoStep from './steps/BasicInfoStep';
import PricingStep from './steps/PricingStep';
import InventoryStep from './steps/InventoryStep';
import ImageStep from './steps/ImageStep';
import ReviewStep from './steps/ReviewStep';

const { Text } = Typography;

const ProductForm: React.FC<ProductFormProps> = ({
  categories = [],
  onSuccess,
  editMode = false,
  initialData
}) => {
  const { t } = useTranslation();

  const defaultValues = {
    name: '',
    barcode: '',
    price: 0,
    batch_price: 0,
    category_id: 0,
    units_per_batch: 1,
    stock: 0,
    reorder_level: 5,
    brand: '',
    expiration_date: null,
    image: undefined,
  };

  const {
    data, setData, processing, errors, formErrors,
    currentStep, calculatedUnitPrice, handleStepChange,
    canGoToNextStep, submit, resetForm
  } = useProductForm(initialData || defaultValues, defaultValues, onSuccess);

  const {
    fileList, imagePreviewUrl, isImageUploaded,
    beforeUpload, handleChange, resetImage
  } = useImageUpload();

  const steps = [
    {
      title: t('products.form.steps.basicInfo'),
      icon: <InfoCircleOutlined />,
      content: <BasicInfoStep
        data={data}
        setData={setData}
        errors={errors}
        onNext={() => handleStepChange(1)}
        categories={categories}
        canProceed={canGoToNextStep()}
      />
    },
    {
      title: t('products.form.steps.pricing'),
      icon: <DollarOutlined />,
      content: <PricingStep
        data={data}
        setData={setData}
        errors={errors}
        onNext={() => handleStepChange(2)}
        onPrevious={() => handleStepChange(0)}
        canProceed={canGoToNextStep()}
        calculatedUnitPrice={calculatedUnitPrice}
      />
    },
    {
      title: t('products.form.steps.inventory'),
      icon: <BoxPlotOutlined />,
      content: <InventoryStep
        data={data}
        setData={setData}
        errors={errors}
        onNext={() => handleStepChange(3)}
        onPrevious={() => handleStepChange(1)}
      />
    },
    {
      title: t('products.form.steps.image'),
      icon: <CloudUploadOutlined />,
      content: <ImageStep
        data={data}
        setData={setData}
        errors={errors}
        onNext={() => handleStepChange(4)}
        onPrevious={() => handleStepChange(2)}
        fileList={fileList}
        imagePreviewUrl={imagePreviewUrl}
        isImageUploaded={isImageUploaded}
        beforeUpload={beforeUpload}
        handleChange={handleChange}
        resetImage={resetImage}
      />
    },
    {
      title: t('products.form.steps.review'),
      icon: <SaveOutlined />,
      content: <ReviewStep
        data={data}
        setData={setData}
        errors={errors}
        onPrevious={() => handleStepChange(3)}
        categories={categories}
        imagePreviewUrl={imagePreviewUrl}
        formErrors={formErrors}
        processing={processing}
        onSubmit={(e) => submit(e, fileList)}
        resetForm={resetForm}
        editMode={editMode}
      />
    }
  ];

  return (
    <div className="product-form">
      <Head title={editMode ? t('products.form.editProduct') : t('products.form.addProduct')} />

      <Card bordered={false} className="mb-6">
        <Steps
          current={currentStep}
          onChange={handleStepChange}
          items={steps.map((item, index) => ({
            title: item.title,
            icon: item.icon,
            status: currentStep === index ? 'process' :
                   currentStep > index ? 'finish' : 'wait'
          }))}
          responsive={true}
          className="mb-6 product-steps"
        />

        <Divider className="my-6" />

        <div className="steps-content">
          {processing ? (
            <div className="text-center py-8">
              <Spin size="large" />
              <div className="mt-4">
                <Text>{editMode ? t('products.form.updating') : t('products.form.adding')}</Text>
              </div>
            </div>
          ) : (
            steps[currentStep].content
          )}
        </div>
      </Card>

      <style jsx>{`
        .product-steps .ant-steps-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .steps-content {
          min-height: 300px;
          padding: 8px;
        }

        @media (max-width: 768px) {
          .ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item-content {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductForm;
