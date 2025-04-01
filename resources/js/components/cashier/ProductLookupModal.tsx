import { Modal, Select } from 'antd';
import React from 'react';
import { ProductType } from '../../types/cashier';

const { Option } = Select;

interface ProductLookupModalProps {
    visible: boolean;
    products: ProductType[];
    selectedProduct: string | null;
    onProductSelect: (productId: string) => void;
    onOk: () => void;
    onCancel: () => void;
}

const ProductLookupModal: React.FC<ProductLookupModalProps> = ({ visible, products, selectedProduct, onProductSelect, onOk, onCancel }) => {
    // Function to format price with thousands separators
    const formatPrice = (price: number): string => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <Modal title="Product Lookup" open={visible} onOk={onOk} onCancel={onCancel} okButtonProps={{ disabled: !selectedProduct }}>
            <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Search for a product"
                optionFilterProp="children"
                onChange={(value) => onProductSelect(value)}
                filterOption={(input, option) => (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())}
            >
                {Array.isArray(products) &&
                    products.map((product) => (
                        <Option key={product.id} value={product.id}>
                            {product.name} - IQD {formatPrice(product.price)} ({product.stock} in stock)
                        </Option>
                    ))}
            </Select>
        </Modal>
    );
};

export default ProductLookupModal;
