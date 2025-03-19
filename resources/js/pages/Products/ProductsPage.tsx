import React, { useState } from 'react';
import { Button, Input, Space, Table, Tag, Modal, Form, InputNumber, Select, Upload } from 'antd';
import { SearchOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {type BreadCrumb } from '@/types'

import {ProductType} from '@/types';

const ProductsPage: React.FC = () => {
    const { products = [], categories = [] } = usePage().props as unknown as {
        products: ProductType[];
        categories: string[];
    };

    const [searchText, setSearchText] = useState('');
    const [searchCategory, setSearchCategory] = useState<string | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const filteredProducts = products.filter(product => {
        const matchesText = searchText === '' ||
            product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.barcode.includes(searchText);

        const matchesCategory = !searchCategory || product.category === searchCategory;

        return matchesText && matchesCategory;
    });

    const columns: ColumnsType<ProductType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price.toFixed(2)}`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => (
                <Tag color={category === 'Electronics' ? 'blue' : category === 'Kitchen' ? 'green' : 'orange'}>
                    {category}
                </Tag>
            ),
            filters: categories.map(category => ({ text: category, value: category })),
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            sorter: (a, b) => a.stock - b.stock,
        },
        {
            title: 'Barcode',
            dataIndex: 'barcode',
            key: 'barcode',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Edit</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                console.log('Form values:', values);
                // Here you would typically submit the form to your backend
                // For now, we'll just close the modal
                setIsModalVisible(false);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const breadcrumbs: BreadCrumbItem[] = [
        {title: 'Dashboard', href: route('dashboard')},
        {title: 'Products', href: route('product.index')},
    ]
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <div className="products-dashboard">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products Management</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Add Product
                </Button>
            </div>

            <div className="mb-4 flex gap-4">
                <Input
                    placeholder="Search by name or barcode"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    placeholder="Filter by category"
                    style={{ width: 200 }}
                    allowClear
                    onChange={value => setSearchCategory(value)}
                >
                    {categories.map(category => (
                        <Select.Option key={category} value={category}>{category}</Select.Option>
                    ))}
                </Select>
            </div>

            <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="key"
                pagination={{ pageSize: 10 }}
            />

            {/* Add Product Modal */}
            <Modal
                title="Add New Product"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="add_product_form"
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
                            prefix="$"
                            placeholder="0.00"
                        />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select placeholder="Select a category">
                            {categories.map(category => (
                                <Select.Option key={category} value={category}>{category}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="stock"
                        label="Stock Quantity"
                        rules={[{ required: true, message: 'Please enter stock quantity' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                    </Form.Item>

                    <Form.Item
                        name="barcode"
                        label="Barcode"
                        rules={[{ required: true, message: 'Please enter barcode' }]}
                    >
                        <Input placeholder="Enter barcode" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea rows={4} placeholder="Enter product description" />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Product Image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload name="image" listType="picture" maxCount={1} beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
        </AppLayout>
    );
};

export default ProductsPage;
