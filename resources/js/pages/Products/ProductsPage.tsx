import React, { useState } from 'react';
import { Button, Input, Space, Table, Tag, Select, Image, Typography, Badge, Slider, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import dayjs from 'dayjs';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface ProductType {
    key: string;
    id: string;
    name: string;
    price: number;
    barcode: string;
    category: string;
    stock: number;
    image_path?: string;
    expiring_soon?: boolean;
    expired?: boolean;
    days_until_expiration?: number;
    low_stock?: boolean;
}

interface CategoryType {
    id: number;
    name: string;
}

interface BreadCrumb {
    title: string;
    href: string;
}

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
        categories: CategoryType[];
    };

    const [searchText, setSearchText] = useState('');
    const [searchCategory, setSearchCategory] = useState<string | null>(null);
    const [stockRange, setStockRange] = useState<[number, number] | null>(null);
    const [expirationRange, setExpirationRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [showLowStock, setShowLowStock] = useState<boolean | null>(null);
    const [expirationStatus, setExpirationStatus] = useState<string | boolean | null>(null);

    const getMaxStock = () => {
        if (products.length === 0) return 100;
        return Math.max(...products.map(product => product.stock));
    };

    const filteredProducts = products.filter(product => {
        // Text search filter
        const matchesText = searchText === '' ||
            product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.barcode.includes(searchText);

        // Category filter
        const matchesCategory = !searchCategory || product.category === searchCategory;

        // Stock range filter
        const matchesStockRange = !stockRange ||
            (product.stock >= stockRange[0] && product.stock <= stockRange[1]);

        // Low stock filter
        const matchesLowStock = showLowStock === null ||
            (showLowStock === true ? product.low_stock : !product.low_stock);

        // Expiration status filter
        const matchesExpirationStatus = expirationStatus === null ||
            (expirationStatus === "expired" ? product.expired :
             expirationStatus === true ? product.expiring_soon && !product.expired :
             !product.expiring_soon && !product.expired);

        // Expiration date range filter
        let matchesExpirationRange = true;
        if (expirationRange && product.days_until_expiration !== undefined) {
            const today = dayjs();
            const productExpirationDate = today.add(product.days_until_expiration, 'day');
            matchesExpirationRange = productExpirationDate.isAfter(expirationRange[0]) &&
                                    productExpirationDate.isBefore(expirationRange[1]);
        }

        return matchesText && matchesCategory && matchesStockRange &&
               matchesLowStock && matchesExpirationStatus && matchesExpirationRange;
    });

    const columns: ColumnsType<ProductType> = [
        {
            title: 'Image',
            key: 'image',
            width: 80,
            render: (_, record) => (
                record.image_path ? (
                    <Image
                        src={`/storage/${record.image_path}`}
                        alt={record.name}
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover' }}
                        fallback="data:image/png;base64,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"
                    />
                ) : (
                    <div className="w-[50px] h-[50px] bg-gray-100 flex items-center justify-center">
                        <Text type="secondary">No Image</Text>
                    </div>
                )
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Link href={route('products.edit', record.id)}>{text}</Link>,
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
            filters: categories.map(category => ({ text: category.name, value: category.name })),
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock, record) => (
                <Space>
                    {record.low_stock ? (
                        <Badge status="warning" text={`${stock} (Low)`} />
                    ) : (
                        stock
                    )}
                </Space>
            ),
            sorter: (a, b) => a.stock - b.stock,
        },
        {
            title: 'Barcode',
            dataIndex: 'barcode',
            key: 'barcode',
        },
   {
       title: 'Expiration',
       key: 'expiration',
       render: (_, record) => {
           if (record.expired) {
               return <Badge status="error" text="Expired" />;
           } else if (record.days_until_expiration !== undefined) {
               if (record.days_until_expiration > 30) {
                   const months = Math.floor(record.days_until_expiration / 30);
                   const remainingDays = record.days_until_expiration % 30;

                   return (
                       <Text>
                           {months} {months === 1 ? 'month' : 'months'}
                           {remainingDays > 0 ? ` ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}` : ''}
                       </Text>
                   );
               } else if (record.days_until_expiration <= 14) {
                   return (
                       <Text type="danger" style={{ fontWeight: 'bold' }}>
                           <WarningOutlined style={{ marginRight: 4 }} />
                           {record.days_until_expiration} {record.days_until_expiration === 1 ? 'day' : 'days'}
                       </Text>
                   );
               } else {
                   return <Text>{record.days_until_expiration} days</Text>;
               }
           } else {
               return <Text type="secondary">No date</Text>;
           }
       },
       sorter: (a, b) => {
           const daysA = a.days_until_expiration ?? Infinity;
           const daysB = b.days_until_expiration ?? Infinity;
           return daysA - daysB;
       },
   },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={route('products.edit', record.id)}>
                        <Button type="text" icon={<EditOutlined />}>Edit</Button>
                    </Link>
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            // Delete action
                        }}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const breadcrumbs: BreadCrumb[] = [
        {title: 'Dashboard', href: route('dashboard')},
        {title: 'Products', href: route('product.index')},
    ];

    const resetFilters = () => {
        setSearchText('');
        setSearchCategory(null);
        setStockRange(null);
        setExpirationRange(null);
        setShowLowStock(null);
        setExpirationStatus(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="products-dashboard">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products Management</h1>
                    <Link href={route('products.create')}>
                        <Button type="primary" icon={<PlusOutlined />}>
                            Add Product
                        </Button>
                    </Link>
                </div>

                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="mb-3 font-semibold">Filters</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Text search */}
                        <div>
                            <div className="mb-1 text-sm text-gray-600">Search</div>
                            <Input
                                placeholder="Search by name or barcode"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>

                        {/* Category filter */}
                        <div>
                            <div className="mb-1 text-sm text-gray-600">Category</div>
                            <Select
                                placeholder="Filter by category"
                                style={{ width: '100%' }}
                                allowClear
                                value={searchCategory}
                                onChange={(value) => setSearchCategory(value)}
                            >
                                {categories.map((category) => (
                                    <Select.Option key={category.id} value={category.name}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        {/* Stock range filter */}
                        <div>
                            <div className="mb-1 text-sm text-gray-600">Stock Range</div>
                            <Slider
                                range
                                min={0}
                                max={getMaxStock()}
                                value={stockRange || [0, getMaxStock()]}
                                onChange={(value) => setStockRange(value as [number, number])}
                            />
                        </div>

                        {/* Low stock filter */}
                        <div>
                            <div className="mb-1 text-sm text-gray-600">Stock Status</div>
                            <Select
                                placeholder="Stock status"
                                style={{ width: '100%' }}
                                allowClear
                                value={showLowStock}
                                onChange={(value) => setShowLowStock(value)}
                            >
                                <Select.Option value={true}>Low Stock</Select.Option>
                                <Select.Option value={false}>Normal Stock</Select.Option>
                            </Select>
                        </div>

                        {/* Expiration range */}
                        <div>
                            <div className="mb-1 text-sm text-gray-600">Expiration Date</div>
                            <RangePicker
                                style={{ width: '100%' }}
                                value={expirationRange}
                                onChange={(dates) => setExpirationRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                            />
                        </div>

                        {/* Expiration status filter */}
                        <div>
                            <div className="mb-1 text-sm text-gray-600">Expiration Status</div>
                            <Select
                                placeholder="Expiration status"
                                style={{ width: '100%' }}
                                allowClear
                                value={expirationStatus}
                                onChange={(value) => setExpirationStatus(value)}
                            >
                                <Select.Option value="expired">Expired</Select.Option>
                                <Select.Option value={true}>Expiring Soon</Select.Option>
                                <Select.Option value={false}>Not Expiring Soon</Select.Option>
                            </Select>
                        </div>

                        {/* Reset button */}
                        <div className="flex items-end">
                            <Button onClick={resetFilters}>
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Product counts summary */}
                <div className="mb-4 flex flex-wrap gap-4">
                    <Tag color="blue">Total: {products.length}</Tag>
                    <Tag color="orange">Low Stock: {products.filter(p => p.low_stock).length}</Tag>
                    <Tag color="red">Expiring Soon: {products.filter(p => p.expiring_soon).length}</Tag>
                    <Tag color="black">Expired: {products.filter(p => p.expired).length}</Tag>
                    <Tag color="purple">Filtered: {filteredProducts.length}</Tag>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="key"
                    pagination={{ pageSize: 5 }}
                    bordered
                />
            </div>
        </AppLayout>
    );
};

export default ProductsPage;
