import { Modal, Select } from 'antd';
import React from 'react';
import { ProductType } from '../../types/cashier';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    const formatPrice = (price: number): string => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <Modal
            title={t('cashier.productLookup.title')}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            okButtonProps={{ disabled: !selectedProduct }}
            okText={t('common.ok')}
            cancelText={t('common.cancel')}
        >
            <Select
                showSearch
                style={{ width: '100%' }}
                placeholder={t('cashier.productLookup.searchPlaceholder')}
                optionFilterProp="label"
                onChange={(value) => onProductSelect(value)}
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={Array.isArray(products) ? products.map((product) => ({
                    value: product.id,
                    label: `${product.name} - ${t('common.currency')} ${formatPrice(product.price)} (${product.stock > 0 ? t('cashier.productLookup.inStock', { stock: product.stock }) : 'Out of Stock'})`
                })) : []}
            />
        </Modal>
    );
};

export default ProductLookupModal;
