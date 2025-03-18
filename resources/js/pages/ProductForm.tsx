import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Upload, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';

const { Option } = Select;
const { TextArea } = Input;

interface ProductFormProps {
  categories: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({ categories = [] }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<Array<any>>([]);

  // Handle form submission
  const onFinish = (values: Record<string, any>) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'image' && fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      } else {
        formData.append(key, values[key]);
      }
    });

    // Submit to server using Inertia
    router.post(route('products.store'), formData, {
      forceFormData: true,
      onSuccess: () => {
        message.success('Product added successfully!');
        form.resetFields();
        setFileList([]);
      },
      onError: (errors) => {
        message.error('Failed to add product. Please check the form.');
        console.error(errors);
      }
    });
  };

  // Handle file upload
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isImage && isLt2M;
  };

  interface UploadChangeInfo {
    fileList: Array<any>;
  }

  const handleChange = ({ fileList }: UploadChangeInfo) => setFileList(fileList);

  return (
    <Card title="Add New Product" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ stock: 0, price: 0 }}
      >
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => {
              const parsedValue = value?.replace(/\$\s?|(,*)/g, '') || '0';
              return parseFloat(parsedValue);
            }}
            placeholder="Enter price"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select a category">
            {Array.isArray(categories) ? categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            )) : null}
          </Select>
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock"
          rules={[{ required: true, message: 'Please enter stock quantity' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter stock quantity" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea rows={4} placeholder="Enter product description" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Product Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            fileList={fileList}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductForm;
