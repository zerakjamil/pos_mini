    // steps/ImageStep.tsx
    import React from 'react';
    import { Form, Button, Upload, Empty, Card, Typography } from 'antd';
    import { UploadOutlined, RedoOutlined } from '@ant-design/icons';
    import { StepProps } from '../types';
    import { useTranslation } from 'react-i18next';

    const { Title, Text } = Typography;

    const ImageStep: React.FC<StepProps> = ({
        data,
        errors,
        onNext,
        onPrevious,
        fileList = [],
        imagePreviewUrl,
        isImageUploaded,
        beforeUpload,
        handleChange,
        resetImage
    }) => {
        const { t } = useTranslation();

        return (
            <Card className="shadow-sm">
                <div className="text-center mb-4">
                    <Title level={5}>{t('products.imageStep.title')}</Title>
                    <Text type="secondary">{t('products.imageStep.description')}</Text>
                </div>

                <div className="flex flex-col items-center">
                    <div className="mb-4 w-full max-w-md">
                        {imagePreviewUrl ? (
                            <div className="relative border rounded-md overflow-hidden" style={{ height: '200px' }}>
                                <img
                                    src={imagePreviewUrl}
                                    alt={t('products.imageStep.previewAlt')}
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
                                        aria-label={t('products.imageStep.resetImage')}
                                    />
                                </div>
                            </div>
                        ) : (
                            <Empty
                                description={t('products.imageStep.noImage')}
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
                                {isImageUploaded ? t('products.imageStep.imageSelected') : t('products.imageStep.selectImage')}
                            </Button>
                        </Upload>
                    </Form.Item>
                </div>

                <div className="flex justify-between mt-4">
                    <Button onClick={onPrevious}>
                        {t('common.previous')}
                    </Button>
                    <Button
                        type="primary"
                        onClick={onNext}
                    >
                        {t('products.imageStep.nextReview')}
                    </Button>
                </div>
            </Card>
        );
    };

    export default ImageStep;
