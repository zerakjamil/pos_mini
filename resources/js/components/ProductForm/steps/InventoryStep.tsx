// steps/InventoryStep.tsx
import { CalculatorOutlined, CalendarOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, InputNumber, Modal, Radio, Row, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { StepProps } from '../types';
import { useTranslation } from 'react-i18next';

const InventoryStep: React.FC<StepProps> = ({ data, setData, errors, onNext, onPrevious }) => {
    const { t } = useTranslation();
    const [calculatorVisible, setCalculatorVisible] = useState(false);
    const [reorderCalculatorVisible, setReorderCalculatorVisible] = useState(false);
    const [containers, setContainers] = useState<number | null>(null);
    const [unitsPerContainer, setUnitsPerContainer] = useState<number | null>(null);
    const [calculationResult, setCalculationResult] = useState<number | null>(null);
    const [reorderContainers, setReorderContainers] = useState<number | null>(null);
    const [reorderCalculationResult, setReorderCalculationResult] = useState<number | null>(null);
    const [reorderMode, setReorderMode] = useState<'units' | 'containers'>('units');

    const calculateStock = () => {
        if (containers && unitsPerContainer) {
            const result = containers * unitsPerContainer;
            setCalculationResult(result);
            setData('stock', result);
        }
    };

    const calculateReorderLevel = () => {
        if (reorderMode === 'containers' && reorderContainers) {
            // Use the same unitsPerContainer as in stock calculation
            const unitsPerBox = unitsPerContainer || 1;
            const result = reorderContainers * unitsPerBox;
            setReorderCalculationResult(result);
            setData('reorder_level', result);
        } else if (reorderMode === 'units' && reorderCalculationResult !== null) {
            setData('reorder_level', reorderCalculationResult);
        }
    };

    const applyCalculation = () => {
        calculateStock();
        setCalculatorVisible(false);
    };

    const applyReorderCalculation = () => {
        calculateReorderLevel();
        setReorderCalculatorVisible(false);
    };

    const openReorderCalculator = () => {
        // Pre-set the units per container based on the stock calculation
        setReorderCalculatorVisible(true);
    };

    return (
        <Card className="shadow-sm">
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={
                            <Space>
                                {t('products.inventoryStep.currentStock')}
                                <Tooltip title={t('products.inventoryStep.calculateStockTooltip')}>
                                    <Button type="text" icon={<CalculatorOutlined />} onClick={() => setCalculatorVisible(true)} size="small" />
                                </Tooltip>
                            </Space>
                        }
                        validateStatus={errors.stock ? 'error' : ''}
                        help={errors.stock}
                        required
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder={t('products.inventoryStep.currentQuantityPlaceholder')}
                            value={data.stock}
                            onChange={(value) => setData('stock', value ?? 0)}
                            min={0}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={
                            <Space>
                                {t('products.inventoryStep.reorderLevel')}
                                <Tooltip title={t('products.inventoryStep.reorderLevelTooltip')}>
                                    <Button type="text" icon={<CalculatorOutlined />} onClick={openReorderCalculator} size="small" />
                                </Tooltip>
                            </Space>
                        }
                        validateStatus={errors.reorder_level ? 'error' : ''}
                        help={errors.reorder_level}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder={t('products.inventoryStep.reorderThresholdPlaceholder')}
                            value={data.reorder_level}
                            onChange={(value) => setData('reorder_level', value ?? 5)}
                            min={0}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label={
                    <Space>
                        <CalendarOutlined /> {t('products.inventoryStep.expirationDate')}
                    </Space>
                }
                validateStatus={errors.expiration_date ? 'error' : ''}
                help={errors.expiration_date}
            >
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder={t('products.inventoryStep.selectExpirationDate')}
                    value={data.expiration_date || null}
                    onChange={(date) => setData('expiration_date', date)}
                    disabledDate={(current) => current && current < dayjs().endOf('day')}
                />
            </Form.Item>

            <div className="mt-4 flex justify-between">
                <Button onClick={onPrevious}>{t('common.previous')}</Button>
                <Button type="primary" onClick={onNext}>
                    {t('products.inventoryStep.nextImage')}
                </Button>
            </div>

            {/* Stock Calculator Modal */}
            <Modal
                title={t('products.inventoryStep.stockCalculator')}
                open={calculatorVisible}
                onCancel={() => setCalculatorVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setCalculatorVisible(false)}>
                        {t('common.cancel')}
                    </Button>,
                    <Button key="apply" type="primary" onClick={applyCalculation}>
                        {t('common.apply')}
                    </Button>,
                ]}
            >
                <div className="my-4 space-y-4">
                    <Form.Item label={t('products.inventoryStep.numberOfContainers')}>
                        <InputNumber style={{ width: '100%' }} value={containers} onChange={setContainers} min={0} placeholder={t('products.inventoryStep.containersPlaceholder')} />
                    </Form.Item>

                    <Form.Item label={t('products.inventoryStep.unitsPerContainer')}>
                        <InputNumber
                            style={{ width: '100%' }}
                            value={unitsPerContainer}
                            onChange={setUnitsPerContainer}
                            min={1}
                            placeholder={t('products.inventoryStep.unitsPerContainerPlaceholder')}
                        />
                    </Form.Item>

                    <Button type="default" onClick={calculateStock} className="mb-2" block>
                        {t('common.calculate')}
                    </Button>

                    {calculationResult !== null && (
                        <div className="rounded border border-blue-200 bg-blue-50 p-3">
                            <strong>{t('products.inventoryStep.totalUnits')}:</strong> {calculationResult}
                            {containers && unitsPerContainer && (
                                <span className="text-gray-500">
                                    {' '}
                                    ({containers} × {unitsPerContainer})
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Modal>

            {/* Reorder Level Calculator Modal */}
            <Modal
                title={t('products.inventoryStep.reorderLevelCalculator')}
                open={reorderCalculatorVisible}
                onCancel={() => setReorderCalculatorVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setReorderCalculatorVisible(false)}>
                        {t('common.cancel')}
                    </Button>,
                    <Button key="apply" type="primary" onClick={applyReorderCalculation}>
                        {t('common.apply')}
                    </Button>,
                ]}
            >
                <div className="my-4 space-y-4">
                    <Form.Item label={t('products.inventoryStep.reorderLevelType')}>
                        <Radio.Group value={reorderMode} onChange={(e) => setReorderMode(e.target.value)}>
                            <Radio.Button value="units">{t('products.inventoryStep.individualUnits')}</Radio.Button>
                            <Radio.Button value="containers">{t('products.inventoryStep.containers')}</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {reorderMode === 'units' ? (
                        <Form.Item label={t('products.inventoryStep.unitsToReorderAt')}>
                            <InputNumber
                                style={{ width: '100%' }}
                                value={reorderCalculationResult}
                                onChange={setReorderCalculationResult}
                                min={0}
                                placeholder={t('products.inventoryStep.unitsToReorderAtPlaceholder')}
                            />
                        </Form.Item>
                    ) : (
                        <>
                            <Form.Item label={t('products.inventoryStep.containersToReorderAt')}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    value={reorderContainers}
                                    onChange={setReorderContainers}
                                    min={0}
                                    placeholder={t('products.inventoryStep.containersToReorderAtPlaceholder')}
                                />
                            </Form.Item>

                            {unitsPerContainer ? (
                                <div className="mb-4 rounded border border-blue-100 bg-blue-50 p-3">
                                    <strong>{t('products.inventoryStep.unitsPerContainer')}:</strong> {unitsPerContainer}
                                    <div className="mt-1 text-xs text-gray-500">{t('products.inventoryStep.usingStockCalculationValue')}</div>
                                </div>
                            ) : (
                                <div className="mb-4 rounded border border-amber-100 bg-amber-50 p-3 text-amber-800">
                                    {t('products.inventoryStep.setUnitsPerContainerFirst')}
                                </div>
                            )}

                            <Button
                                type="default"
                                onClick={calculateReorderLevel}
                                className="mb-2"
                                block
                                disabled={!unitsPerContainer || !reorderContainers}
                            >
                                {t('common.calculate')}
                            </Button>

                            {reorderCalculationResult !== null && reorderMode === 'containers' && (
                                <div className="rounded border border-blue-200 bg-blue-50 p-3">
                                    <strong>{t('products.inventoryStep.reorderAt')}:</strong> {reorderCalculationResult} {t('products.inventoryStep.units')}
                                    {reorderContainers && unitsPerContainer && (
                                        <span className="text-gray-500">
                                            {' '}
                                            ({reorderContainers} × {unitsPerContainer})
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Modal>
        </Card>
    );
};

export default InventoryStep;
