import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Input, Button, Space } from 'antd';
import { BarcodeOutlined, SearchOutlined } from '@ant-design/icons';

interface BarcodeScannerProps {
  onBarcodeScan: (barcode: string) => void;
  onProductLookup: () => void;
}

const BarcodeScanner = forwardRef<{ focusInput: () => void }, BarcodeScannerProps>(
  ({ onBarcodeScan, onProductLookup }, ref) => {
    const [barcode, setBarcode] = useState<string>('');
    const inputRef = React.useRef<Input>(null);

    // Expose focusInput method to parent component
    useImperativeHandle(ref, () => ({
      focusInput: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (barcode.trim()) {
        onBarcodeScan(barcode.trim());
        setBarcode('');
      }
    };

    // Focus input on component mount
    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    return (
      <div className="barcode-scanner mb-4">
        <form onSubmit={handleSubmit}>
          <Space style={{ width: '100%' }}>
            <Input
              ref={inputRef}
              size="large"
              placeholder="Scan barcode or enter product code"
              prefix={<BarcodeOutlined />}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              autoFocus
              style={{ width: '400px' }}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => onProductLookup()}
            >
              Find Product
            </Button>
          </Space>
        </form>
      </div>
    );
  }
);

export default BarcodeScanner;
