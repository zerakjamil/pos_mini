import React, { useState, useEffect, useRef } from 'react';
import { Space, Table, Tag, Button, Input, message } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

interface ProductType {
  key: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  tags: string[];
  barcode: string;
}

interface ProductTableProps {
  products: ProductType[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const [barcodeTimeout, setBarcodeTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const barcodeInputRef = useRef<Input>(null);
  const [tableFilters, setTableFilters] = useState<Record<string, any>>({});

  // Handle barcode scanner input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field that's not our barcode field
      if (
        document.activeElement instanceof HTMLInputElement &&
        document.activeElement !== barcodeInputRef.current?.input
      ) {
        return;
      }

      // Barcode scanners typically end with Enter key
      if (e.key === 'Enter' && barcodeBuffer) {
        e.preventDefault();
        handleBarcodeScanned(barcodeBuffer);
        setBarcodeBuffer('');
        return;
      }

      // Only accept alphanumeric characters for barcodes
      if (/^[a-zA-Z0-9]$/.test(e.key)) {
        // Reset timeout for new scan
        if (barcodeTimeout) clearTimeout(barcodeTimeout);

        // Set a new timeout - barcode scanners are fast, so if there's a delay, it's likely manual typing
        const newTimeout = setTimeout(() => {
          setBarcodeBuffer('');
        }, 100);

        setBarcodeTimeoutRef(newTimeout);
        setBarcodeBuffer(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (barcodeTimeout) clearTimeout(barcodeTimeout);
    };
  }, [barcodeBuffer, barcodeTimeout]);

  const handleBarcodeScanned = (barcode: string) => {
    // Focus the barcode search input
    if (barcodeInputRef.current) {
      const inputElement = barcodeInputRef.current.input;
      if (inputElement) {
        inputElement.focus();

        // Set the barcode as the filter value
        const newFilters = {
          ...tableFilters,
          barcode: [barcode]
        };
        setTableFilters(newFilters);

        // Apply the filter to the table
        const barcodeColumn = columns.find(col => col.dataIndex === 'barcode');
          if (barcodeColumn && !barcodeColumn.filteredValue.includes(barcode)) {
              barcodeColumn.filteredValue = [barcode];
          }

        // Show a notification
        message.info(`Scanning barcode: ${barcode}`);

        // Trigger search
        handleSearch([barcode], () => {}, 'barcode');
      }
    }
  };

  const handleSearch = (selectedKeys: string[], confirm: () => void, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof ProductType) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={dataIndex === 'barcode' ? barcodeInputRef : null}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters!)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: string, record: ProductType) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filteredValue: tableFilters[dataIndex] || null,
  });

  const columns: ColumnsType<ProductType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      ...getColumnSearchProps('barcode'),
      sorter: (a, b) => a.barcode.localeCompare(b.barcode),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: Array.from(new Set(products.map(product => product.category)))
        .map(category => ({ text: category, value: category })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
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

  const onChange: TableProps<ProductType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    setTableFilters(filters);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Scan barcode here"
          ref={barcodeInputRef}
          style={{ width: 300 }}
          onPressEnter={(e) => {
            const value = e.currentTarget.value;
            if (value) {
              handleBarcodeScanned(value);
              e.currentTarget.value = '';
            }
          }}
        />
        <span style={{ marginLeft: 8 }}>
          (Focus here and scan your barcode)
        </span>
      </div>
      <Table columns={columns} dataSource={products} onChange={onChange} />
    </>
  );
};

export default ProductTable;
