    // steps/ImageStep.tsx
    import React from 'react';
    import { Form, Button, Upload, Empty, Card, Typography } from 'antd';
    import { UploadOutlined, RedoOutlined } from '@ant-design/icons';
    import { StepProps } from '../types';

    const { Title, Text } = Typography;

    const ImageStep: React.FC<StepProps> = ({
    data,
    errors,
    onNext,
    onPrevious,
    fileList = [], // Add default value
    imagePreviewUrl,
    isImageUploaded,
    beforeUpload,
    handleChange,
    resetImage
    }) => {
    return (
      <Card className="shadow-sm">
        {/* Component content */}
        <div className="text-center mb-4">
          <Title level={5}>Product Image</Title>
          <Text type="secondary">Upload an image of your product (optional)</Text>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-4 w-full max-w-md">
            {imagePreviewUrl ? (
              <div className="relative border rounded-md overflow-hidden" style={{ height: '200px' }}>
                <img
                  src={imagePreviewUrl}
                  alt="Product Preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    type="primary"
                    danger
                    shape="circle"
                    icon={<RedoOutlined />}
                    size="small"
                    onClick={resetImage}
                  />
                </div>
              </div>
            ) : (
              <Empty
                description="No image uploaded"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="border border-dashed border-gray-300 rounded-md p-8"
              />
            )}
          </div>

          <Form.Item
            validateStatus={errors.image ? 'error' : ''}
            help={errors.image}
          >
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} disabled={isImageUploaded}>
                {isImageUploaded ? 'Image Selected' : 'Select Image'}
              </Button>
            </Upload>
          </Form.Item>
        </div>

        <div className="flex justify-between mt-4">
          <Button onClick={onPrevious}>
            Previous
          </Button>
          <Button
            type="primary"
            onClick={onNext}
          >
            Next: Review
          </Button>
        </div>
      </Card>
    );
    };

    export default ImageStep;
