import React, { useState } from 'react';
import { Button, Input, Space, Table, Tag, Modal, Select, message } from 'antd';
             import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
             import type { ColumnsType } from 'antd/es/table';
             import { usePage } from '@inertiajs/react';
             import AppLayout from '@/layouts/app-layout';
             import { BreadCrumb, ProductType } from '@/types';
                import ProductForm, { ProductFormValues } from '@/pages/ProductForm';

const formatIQD = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IQD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(price)
        .replace('IQD', 'IQD ');
};
             const ProductsPage: React.FC = () => {
                 const { products = [], categories = [] } = usePage().props as unknown as {
                     products: ProductType[];
                     categories: string[];
                 };

                 const [searchText, setSearchText] = useState('');
                 const [searchCategory, setSearchCategory] = useState<string | null>(null);
                 const [isModalVisible, setIsModalVisible] = useState(false);
                 const [loading, setLoading] = useState(false);

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
                         render: (price) => formatIQD(price),
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
                         render: (_: any, _record: ProductType) => (
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

                 const handleCancel = () => {
                     setIsModalVisible(false);
                 };

                 const handleFormSubmit = (values: ProductFormValues) => {
                     console.log('Form submitted with values:', values);
                     message.success('Product added successfully!');
                     setIsModalVisible(false);
                 };

                 const breadcrumbs: BreadCrumb[] = [
                     {title: 'Dashboard', href: route('dashboard')},
                     {title: 'Products', href: route('product.index')},
                 ];

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

                         {/* Modal using ProductForm component */}
                         <Modal
                             title="Add New Product"
                             open={isModalVisible}
                             onCancel={handleCancel}
                             footer={null}
                             width={800}
                         >
                             <ProductForm categories={categories} onSuccess={handleFormSubmit} />
                         </Modal>
                     </div>
                     </AppLayout>
                 );
             };

             export default ProductsPage;
