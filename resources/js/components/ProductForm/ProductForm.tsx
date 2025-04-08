import React, { FormEvent, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
Input, InputNumber, Select, DatePicker,
Button, Card, Form, Upload, Space, Row, Col, message
} from 'antd';
import {
BarcodeOutlined, TagOutlined, ShopOutlined,
SaveOutlined, PlusOutlined, UploadOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

interface Category {
id: number;
name: string;
}

interface ProductData {
id?: number;
name: string;
barcode: string;
brand: string;
category_id: number | undefined;
batch_price: number;
units_per_batch: number;
price: number;
stock: number;
reorder_level: number;
expiration_date: any;
image: any;
image_url?: string;
}

interface ProductFormProps {
    categories?: Category[];
    editMode?: boolean;
    initialData?: ProductData | null;
    method?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
     categories = [],
     editMode = false,
     initialData = null,
     method = 'post'
 }) => {
const { t } = useTranslation();
const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
const [fileList, setFileList] = useState<any[]>([]);
const [addAnother, setAddAnother] = useState(false);

const defaultValues: ProductData = {
name: '',
barcode: '',
brand: '',
category_id: undefined,
batch_price: 0,
units_per_batch: 1,
price: 0,
stock: 0,
reorder_level: 5,
expiration_date: null,
image: null
};

    const { data, setData, post, put, processing, errors, reset } = useForm<ProductData>(
        initialData || defaultValues
    );

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

// Add all form fields to formData
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && key !== 'image' && key !== 'image_url') {
                formData.append(key, String(value));
            }
        });

// Handle file if there is one
        if (fileList.length > 0) {
            formData.append('image', fileList[0].originFileObj);
        }

const url = editMode && initialData?.id
  ? route('product.update', initialData.id)
  : route('product.store');

        if (method === 'put') {
            put(url, {
                onSuccess: () => {
                    message.success(
                        editMode ? t('products.productUpdated') : t('products.productAdded')
                    );

                    if (!editMode && addAnother) {
                        reset();
                        setFileList([]);
                        setImageUrl(null);
                        const firstInput = document.querySelector('input') as HTMLInputElement;
                        if (firstInput) firstInput.focus();
                    } else if (!editMode) {
                        window.location.href = route('product.index');
                    }
                }
            });
        } else {
            post(url, {
                onSuccess: () => {
                    message.success(
                        editMode ? t('products.productUpdated') : t('products.productAdded')
                    );

                    if (addAnother) {
                        reset();
                        setFileList([]);
                        setImageUrl(null);
                        const firstInput = document.querySelector('input') as HTMLInputElement;
                        if (firstInput) firstInput.focus();
                    } else if (!editMode) {
                        window.location.href = route('product.index');
                    }
                }
            });
        }
    };

const uploadProps = {
beforeUpload: (file: File) => {
  setFileList([file]);
  setImageUrl(URL.createObjectURL(file));
  return false;
},
onRemove: () => {
  setFileList([]);
  setImageUrl(null);
},
fileList
};

return (
<Card
  title={editMode ? t('products.editProduct') : t('products.addProduct')}
  extra={
    <Space>
      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={submitHandler}
        loading={processing}
      >
        {t('common.save')}
      </Button>
      {!editMode && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setAddAnother(true);
            submitHandler(new Event('submit') as unknown as FormEvent);
          }}
          loading={processing}
        >
          {t('products.saveAndAddAnother')}
        </Button>
      )}
    </Space>
  }
>
  <Form layout="vertical">
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          label={<Space><BarcodeOutlined /> {t('products.barcode')}</Space>}
          validateStatus={errors.barcode ? 'error' : ''}
          help={errors.barcode}
        >
          <Input
            placeholder={t('products.barcodePlaceholder')}
            value={data.barcode}
            onChange={e => setData('barcode', e.target.value)}
            autoFocus
          />
        </Form.Item>

        <Form.Item
          label={<Space><TagOutlined /> {t('products.name')}</Space>}
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name}
          required
        >
          <Input
            placeholder={t('products.namePlaceholder')}
            value={data.name}
            onChange={e => setData('name', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={<Space><ShopOutlined /> {t('products.brand')}</Space>}
          validateStatus={errors.brand ? 'error' : ''}
          help={errors.brand}
        >
          <Input
            placeholder={t('products.brandPlaceholder')}
            value={data.brand}
            onChange={e => setData('brand', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t('products.category')}
          validateStatus={errors.category_id ? 'error' : ''}
          help={errors.category_id}
          required
        >
          <Select
            placeholder={t('products.categoryPlaceholder')}
            value={data.category_id}
            onChange={value => setData('category_id', value)}
          >
            {categories.map(category => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('products.pricingStep.batchPrice')}
              validateStatus={errors.batch_price ? 'error' : ''}
              help={errors.batch_price}
              required
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder={t('products.pricingStep.enterBatchPrice')}
                value={Number(data.batch_price).toLocaleString()}
                onChange={value => setData('batch_price', value || 0)}
                min={0}
                addonBefore={t('common.currency')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('products.pricingStep.unitsPerBatch')}
              validateStatus={errors.units_per_batch ? 'error' : ''}
              help={errors.units_per_batch}
              required
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder={t('products.pricingStep.numberOfUnits')}
                value={Number(data.units_per_batch).toLocaleString()}
                onChange={value => setData('units_per_batch', value || 1)}
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('products.pricingStep.unitSellingPrice')}
          validateStatus={errors.price ? 'error' : ''}
          help={errors.price}
          required
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('products.pricingStep.enterSellingPricePerUnit')}
            value={Number(data.price).toLocaleString()}
            onChange={value => setData('price', value || 0)}
            min={0}
            addonBefore={t('common.currency')}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('products.inventoryStep.currentStock')}
              validateStatus={errors.stock ? 'error' : ''}
              help={errors.stock}
              required
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder={t('products.inventoryStep.currentQuantityPlaceholder')}
                value={data.stock}
                onChange={value => setData('stock', value || 0)}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('products.inventoryStep.reorderLevel')}
              validateStatus={errors.reorder_level ? 'error' : ''}
              help={errors.reorder_level}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder={t('products.inventoryStep.reorderThresholdPlaceholder')}
                value={data.reorder_level}
                onChange={value => setData('reorder_level', value || 0)}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('products.inventoryStep.expirationDate')}
          validateStatus={errors.expiration_date ? 'error' : ''}
          help={errors.expiration_date}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder={t('products.inventoryStep.selectExpirationDate')}
            value={data.expiration_date}
            onChange={date => setData('expiration_date', date)}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row>
      <Col span={24}>
        <Form.Item label={t('products.imageStep.title')}>
          <div className="flex items-center">
            <Upload {...uploadProps} maxCount={1} listType="picture-card">
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>
                  {t('products.imageStep.upload')}
                </div>
              </div>
            </Upload>
            {imageUrl && (
              <div className="ml-4">
                <img src={imageUrl} alt="Product" style={{ maxHeight: '100px' }} />
              </div>
            )}
          </div>
        </Form.Item>
      </Col>
    </Row>

    <div className="flex justify-end">
      <Space>
        {!editMode && (
          <Form.Item>
            <Button
              type="dashed"
              htmlType="button"
              onClick={() => reset()}
            >
              {t('common.reset')}
            </Button>
          </Form.Item>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            onClick={submitHandler}
            loading={processing}
          >
            {editMode ? t('products.updateProduct') : t('products.addProduct')}
          </Button>
        </Form.Item>
      </Space>
    </div>
  </Form>
</Card>
);
};

export default ProductForm;
