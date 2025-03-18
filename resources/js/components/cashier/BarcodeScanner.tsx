import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Input, Button, Space } from 'antd';
import { BarcodeOutlined, SearchOutlined } from '@ant-design/icons';

interface BarcodeScannerProps {
  onBarcodeScan: (barcode: string) => void;
  onProductLookup: () => void;
}

export interface BarcodeScannerRef {
  focusInput: () => void;
}

const BarcodeScanner = forwardRef<BarcodeScannerRef, BarcodeScannerProps>(
  ({ onBarcodeScan, onProductLookup }, ref) => {
    const [barcode, setBarcode] = useState<string>('');
    const [barcodeBuffer, setBarcodeBuffer] = useState<string>('');
    const [barcodeTimeout, setBarcodeTimeoutRef] = useState<NodeJS.Timeout | null>(null);
    const [lastScannedBarcode, setLastScannedBarcode] = useState<string>('');
    const [lastScanTime, setLastScanTime] = useState<number>(0);
    const inputRef = useRef<Input>(null);

    // Cooldown period to prevent duplicate scans (in milliseconds)
    const scanCooldown = 1500;

    // Expose the focusInput method to parent components
    useImperativeHandle(ref, () => ({
      focusInput: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }));

    // Focus the input when the component mounts
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    // Process a scanned barcode
    const processBarcode = (scannedBarcode: string) => {
      const currentTime = Date.now();

      // Check if this is a duplicate scan (same barcode within cooldown period)
      if (
        scannedBarcode === lastScannedBarcode &&
        currentTime - lastScanTime < scanCooldown
      ) {
        console.log('Duplicate scan detected and ignored');
        return;
      }

      // Update last scan info
      setLastScannedBarcode(scannedBarcode);
      setLastScanTime(currentTime);

      // Process the barcode
      onBarcodeScan(scannedBarcode);
    };

    // Handle barcode scanner input
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore if user is typing in an input field that's not our barcode field
        if (
          document.activeElement instanceof HTMLInputElement &&
          document.activeElement !== inputRef.current?.input
        ) {
          return;
        }

        // Barcode scanners typically end with Enter key
        if (e.key === 'Enter' && barcodeBuffer) {
          e.preventDefault();
          processBarcode(barcodeBuffer);
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
    }, [barcodeBuffer, barcodeTimeout, onBarcodeScan, lastScannedBarcode, lastScanTime]);

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
            placeholder="Scan barcode or enter manually"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onPressEnter={(e) => {
              e.preventDefault(); // Prevent form submission
              handleSubmit();
            }}
            prefix={<BarcodeOutlined />}
            style={{ width: 300 }}
            autoFocus
          />
          <Button type="primary" onClick={handleSubmit}>
            Add
          </Button>
          <Button onClick={onProductLookup} icon={<SearchOutlined />}>
            Product Lookup
          </Button>
        </Space>
      </div>
    );
  }
);

export default BarcodeScanner;
