import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Input, Button, Space } from 'antd';
import { BarcodeOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface BarcodeScannerProps {
  onBarcodeScan: (barcode: string) => void;
  onProductLookup: () => void;
}

export interface BarcodeScannerRef {
  focusInput: () => void;
}

const BarcodeScanner = forwardRef<BarcodeScannerRef, BarcodeScannerProps>(
  ({ onBarcodeScan, onProductLookup }, ref) => {
    const { t } = useTranslation();
    const [barcode, setBarcode] = useState<string>('');
    const [barcodeBuffer, setBarcodeBuffer] = useState<string>('');
    const [barcodeTimeout, setBarcodeTimeoutRef] = useState<NodeJS.Timeout | null>(null);
    const [lastScannedBarcode, setLastScannedBarcode] = useState<string>('');
    const [lastScanTime, setLastScanTime] = useState<number>(0);
    const inputRef = useRef<Input>(null);

    const scanCooldown = 1500;

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }));

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    const processBarcode = useCallback((scannedBarcode: string) => {
      const currentTime = Date.now();

      if (
        scannedBarcode === lastScannedBarcode &&
        currentTime - lastScanTime < scanCooldown
      ) {
        console.log('Duplicate scan detected and ignored');
        return;
      }

      setLastScannedBarcode(scannedBarcode);
      setLastScanTime(currentTime);

      onBarcodeScan(scannedBarcode);
    }, [lastScannedBarcode, lastScanTime, onBarcodeScan]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          document.activeElement instanceof HTMLInputElement &&
          document.activeElement !== inputRef.current?.input
        ) {
          return;
        }

        if (e.key === 'Enter' && barcodeBuffer) {
          e.preventDefault();
          processBarcode(barcodeBuffer);
          setBarcodeBuffer('');
          return;
        }

        if (/^[a-zA-Z0-9]$/.test(e.key)) {
          if (barcodeTimeout) clearTimeout(barcodeTimeout);

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
    }, [barcodeBuffer, barcodeTimeout, onBarcodeScan, lastScannedBarcode, lastScanTime, processBarcode]);

    const handleSubmit = () => {
      if (barcode.trim()) {
        processBarcode(barcode.trim());
        setBarcode('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    return (
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%' }}>
          <Input
            ref={inputRef}
            placeholder={t('cashier.barcode.placeholder')}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onPressEnter={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            prefix={<BarcodeOutlined />}
            style={{ width: 300 }}
            autoFocus
          />
          <Button
            onClick={onProductLookup}
            icon={<SearchOutlined />}
            aria-label={t('cashier.barcode.productLookup')}
          >
            {t('cashier.barcode.productLookup')}
          </Button>
        </Space>
      </div>
    );
  }
);

export default BarcodeScanner;
