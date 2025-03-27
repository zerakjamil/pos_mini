// hooks/useProductForm.ts
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { message } from 'antd';
import { ProductFormValues } from '../types';

export const useProductForm = (
  initialData: ProductFormValues,
  defaultValues: ProductFormValues,
  onSuccess?: () => void
) => {
  const { data, setData, processing, errors, post } = useForm<ProductFormValues>(initialData || defaultValues);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [calculatedUnitPrice, setCalculatedUnitPrice] = useState<number | null>(null);

  useEffect(() => {
    if (data.batch_price > 0 && data.units_per_batch > 0) {
      const unitPrice = data.batch_price / data.units_per_batch;
      setCalculatedUnitPrice(parseFloat(unitPrice.toFixed(2)));
    } else {
      setCalculatedUnitPrice(null);
    }
  }, [data.batch_price, data.units_per_batch]);

  const canGoToNextStep = () => {
    if (currentStep === 0) {
      return !!data.name && !!data.category_id;
    } else if (currentStep === 1) {
      return data.batch_price > 0 && data.units_per_batch > 0;
    }
    return true;
  };

  const handleStepChange = (step: number) => {
    if (step > currentStep && !canGoToNextStep()) {
      message.warning('Please complete the required fields in this section first.');
      return;
    }
    setCurrentStep(step);
  };

  const submit = (e: React.MouseEvent, fileList: any[]) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (key !== 'image' && key !== 'expiration_date') {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, String(data[key]));
        }
      }
    });

    if (data.expiration_date) {
      formData.append('expiration_date', data.expiration_date.format('YYYY-MM-DD'));
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    post(route('product.store'), formData, {
      onSuccess: () => {
        message.success('Product added successfully!');
        resetForm();
        setFormErrors({});
        if (onSuccess) onSuccess();
      },
      onError: (errors: Record<string, string>) => {
        setFormErrors(errors);
        message.error('Failed to add product. Please check the form.');
        navigateToErrorStep(errors);
      }
    });
  };

  const navigateToErrorStep = (errors: Record<string, string>) => {
    if (errors.name || errors.category_id) {
      setCurrentStep(0);
    } else if (errors.batch_price || errors.price || errors.units_per_batch) {
      setCurrentStep(1);
    } else if (errors.stock || errors.reorder_level || errors.expiration_date) {
      setCurrentStep(2);
    }
  };

  const resetForm = () => {
    Object.keys(defaultValues).forEach(key => {
      setData(key as keyof ProductFormValues, defaultValues[key as keyof ProductFormValues]);
    });
    setCurrentStep(0);
  };

  return {
    data,
    setData,
    processing,
    errors,
    formErrors,
    currentStep,
    calculatedUnitPrice,
    handleStepChange,
    canGoToNextStep,
    submit,
    resetForm
  };
};
