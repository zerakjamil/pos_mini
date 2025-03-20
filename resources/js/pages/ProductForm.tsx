import React, { useState, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { Form, Input, InputNumber, Button, Select, Upload, message, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import type { Dayjs } from 'dayjs';

const { Option } = Select;

interface ProductFormProps {
  categories: { id: number; name: string }[];
  onSuccess?: () => void;
}

interface ProductFormValues {
    name: string;
    barcode: string;
    price: number;
    batch_price: number;
    category_id: number;
    units_per_batch: number;
    stock: number;
    reorder_level: number;
    brand: string;
    expiration_date?: Dayjs | null;
    image?: UploadFile[];
}

const ProductForm: React.FC<ProductFormProps> = ({ categories = [], onSuccess }) => {
  const { data, setData, processing, errors, reset } = useForm<ProductFormValues>({
    name: '',
    barcode: '',
    price: 0,
    batch_price: 0,
    category_id: 0,
    units_per_batch: 1,
    stock: 0,
    reorder_level: 5,
    brand: '',
    expiration_date: undefined,
    image: undefined,
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const submit = () => {
    const formData = new FormData();
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      formData.append('_token', csrfToken);
    }

    Object.keys(data).forEach(key => {
      if (key === 'image' && fileList.length > 0) {
        const file = fileList[0];
        if (file.originFileObj instanceof File) {
          formData.append('image', file.originFileObj);
        }
      } else if (key === 'expiration_date' && data[key]) {
        formData.append(key, (data[key] as Dayjs).format('YYYY-MM-DD'));
      } else if (data[key] !== undefined) {
        formData.append(key, String(data[key]));
      }
    });

    router.post(route('products.store'), formData, {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        message.success('Product added successfully!');
        reset();
        setFileList([]);
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (errors) => {
        message.error('Failed to add product. Please check the form.');
        console.error(errors);
      }
    });
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error('You can only upload image files!');
    }
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }

    return false;
  };

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
    setData('image', fileList);
  };

  return (
    <Form layout="vertical" onFinish={submit}>
      <Head title="Add Product" />

      <Form.Item
        label="Product Name"
        validateStatus={errors.name ? 'error' : ''}
        help={errors.name}
      >
        <Input
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          placeholder="Enter product name"
        />
      </Form.Item>

      <Form.Item
        label="Barcode"
        validateStatus={errors.barcode ? 'error' : ''}
        help={errors.barcode}
      >
        <Input
          value={data.barcode}
          onChange={e => setData('barcode', e.target.value)}
          placeholder="Enter barcode"
        />
      </Form.Item>

      <Form.Item
        label="Unit Price"
        validateStatus={errors.price ? 'error' : ''}
        help={errors.price}
      >
        <InputNumber
          value={data.price}
          onChange={value => setData('price', value as number)}
          min={0}
          step={0.01}
          precision={2}
          style={{ width: '100%' }}
          formatter={value => `IQD ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => Number(value!.replace(/IQD\s?|(,*)/g, ''))}
          placeholder="Enter unit price"
        />
      </Form.Item>

      <Form.Item
        label="Batch Price"
        validateStatus={errors.batch_price ? 'error' : ''}
        help={errors.batch_price}
      >
        <InputNumber
          value={data.batch_price}
          onChange={value => setData('batch_price', value as number)}
          min={0}
          step={0.01}
          precision={2}
          style={{ width: '100%' }}
          formatter={value => `IQD ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => Number(value!.replace(/IQD\s?|(,*)/g, ''))}
          placeholder="Enter batch price"
        />
      </Form.Item>

      <Form.Item
        label="Category"
        validateStatus={errors.category_id ? 'error' : ''}
        help={errors.category_id}
      >
        <Select
          value={data.category_id || undefined}
          onChange={value => setData('category_id', value)}
          placeholder="Select a category"
        >
          {categories.map(category => (
            <Option key={category.id} value={category.id}>{category.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Units Per Batch"
        validateStatus={errors.units_per_batch ? 'error' : ''}
        help={errors.units_per_batch}
      >
        <InputNumber
          value={data.units_per_batch}
          onChange={value => setData('units_per_batch', value as number)}
          min={1}
          style={{ width: '100%' }}
          placeholder="Enter units per batch"
        />
      </Form.Item>

      <Form.Item
        label="Stock"
        validateStatus={errors.stock ? 'error' : ''}
        help={errors.stock}
      >
        <InputNumber
          value={data.stock}
          onChange={value => setData('stock', value as number)}
          min={0}
          style={{ width: '100%' }}
          placeholder="Enter stock quantity"
        />
      </Form.Item>

      <Form.Item
        label="Reorder Level"
        validateStatus={errors.reorder_level ? 'error' : ''}
        help={errors.reorder_level}
      >
        <InputNumber
          value={data.reorder_level}
          onChange={value => setData('reorder_level', value as number)}
          min={0}
          style={{ width: '100%' }}
          placeholder="Enter reorder level"
        />
      </Form.Item>

      <Form.Item
        label="Brand"
        validateStatus={errors.brand ? 'error' : ''}
        help={errors.brand}
      >
        <Input
          value={data.brand}
          onChange={e => setData('brand', e.target.value)}
          placeholder="Enter brand name"
        />
      </Form.Item>

      <Form.Item
        label="Expiration Date"
        validateStatus={errors.expiration_date ? 'error' : ''}
        help={errors.expiration_date}
      >
        <DatePicker
          value={data.expiration_date}
          onChange={value => setData('expiration_date', value)}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label="Product Image"
        validateStatus={errors.image ? 'error' : ''}
        help={errors.image}
      >
        <Upload
          listType="picture"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={processing} className="w-full">
          {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
          Add Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
