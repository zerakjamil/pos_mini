import React, { useState } from 'react';
import { Modal, Input, Table, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ProductType } from '../../types/cashier';

interface ProductLookupModalProps {
  visible: boolean;
  products: ProductType[];
  selectedProduct: string | null;
  onProductSelect: (productId: string) => void;
  onOk: () => void;
  onCancel: () => void;
}

const ProductLookupModal: React.FC<ProductLookupModalProps> = ({
  visible,
  products,
  selectedProduct,
  onProductSelect,
  onOk,
  onCancel,
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.barcode.includes(searchText)
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
    },
  ];

  const rowSelection = {
    type: 'radio' as const,
    selectedRowKeys: selectedProduct ? [selectedProduct] : [],
    onChange: (selectedRowKeys: React.Key[]) => {
      onProductSelect(selectedRowKeys[0] as string);
    },
  };

  return (
    <Modal
      title="Find Product"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={800}
      okButtonProps={{ disabled: !selectedProduct }}
      okText="Add to Cart"
    >
      <div className="mb-4">
        <Input
          placeholder="Search by name or barcode"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          autoFocus
        />
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        size="small"
      />
    </Modal>
  );
};

export default ProductLookupModal;
