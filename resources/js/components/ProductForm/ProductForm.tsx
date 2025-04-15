import React, { FormEvent, useState } from 'react';
            import { useForm } from '@inertiajs/react';
            import {
              Input, InputNumber, Select, DatePicker,
              Button, Card, Form, Upload, Space, Row, Col, message
            } from 'antd';
            import {
              BarcodeOutlined, TagOutlined, ShopOutlined,
              SaveOutlined, PlusOutlined, UploadOutlined
            } from '@ant-design/icons';
            import { useTranslation } from 'react-i18next';
            import { RcFile } from 'antd/lib/upload';
            // Import directly to fix Moment error
            import moment, { Moment } from 'moment';

            const { Option } = Select;

            interface Category {
              id: number;
              name: string;
            }

            interface ProductData {
              id?: number;
              name: string;
              barcode: string;
              brand: string;
              category_id: number | undefined;
              batch_price: number;
              units_per_batch: number;
              price: number;
              stock: number;
              reorder_level: number;
              expiration_date: Moment | null;
              image: File | null;
              image_url?: string;
              [key: string]: string | number | File | Moment | undefined | null;
            }

            interface ProductFormProps {
              categories?: Category[];
              editMode?: boolean;
              initialData?: ProductData | null;
              method?: string;
            }

            const ProductForm: React.FC<ProductFormProps> = ({
              categories = [],
              editMode = false,
              initialData = null,
              method = 'post'
            }) => {
              const { t } = useTranslation();
              const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
              const [fileList, setFileList] = useState<RcFile[]>([]);

              const defaultValues: ProductData = {
                name: '',
                barcode: '',
                brand: '',
                category_id: undefined,
                batch_price: 0,
                units_per_batch: 1,
                price: 0,
                stock: 0,
                reorder_level: 5,
                expiration_date: null,
                image: null
              };

              const { data, setData, post, put, processing, errors, reset } = useForm<ProductData>(
                initialData || defaultValues
              );

              const generateRandomBarcode = () => {
                const randomBarcode = Math.floor(100000000 + Math.random() * 900000000).toString();
                setData('barcode', randomBarcode);
              };

              const submitHandler = (e: FormEvent, saveAndAddAnother: boolean = false) => {
                e.preventDefault();
                const formData = new FormData();

                Object.entries(data).forEach(([key, value]) => {
                  if (value !== null && key !== 'image' && key !== 'image_url') {
                    formData.append(key, String(value));
                  }
                });

                if (fileList.length > 0) {
                  formData.append('image', fileList[0]);
                }

                const url = editMode && initialData?.id
                  ? route('product.update', initialData.id)
                  : route('product.store');

                const successCallback = () => {
                  message.success(
                    editMode ? t('products.productUpdated') : t('products.productAdded')
                  );

                  if (saveAndAddAnother) {
                    reset();
                    setFileList([]);
                    setImageUrl(null);
                    const firstInput = document.querySelector('input') as HTMLInputElement;
                    if (firstInput) firstInput.focus();
                    window.location.href = route('product.create');
                  } else {
                    window.location.href = route('product.index');
                  }
                };

                if (method === 'put') {
                  put(url, { onSuccess: successCallback });
                } else {
                  post(url, { onSuccess: successCallback });
                }
              };

              const uploadProps = {
                beforeUpload: (file: RcFile) => {
                  setFileList([file]);
                  setImageUrl(URL.createObjectURL(file));
                  return false;
                },
                onRemove: () => {
                  setFileList([]);
                  setImageUrl(null);
                },
                fileList
              };

              return (
                <Card
                  title={editMode ? t('products.editProduct') : t('products.addProduct')}
                  extra={
                    <Space>
                        {!editMode &&
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={(e) => submitHandler(e, true)}
                          loading={processing}
                        >
                          {t('products.saveAndAddAnother')}
                        </Button>
                        }
                    </Space>
                  }
                >
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label={
                            <Space style={{ cursor: 'pointer' }} onClick={generateRandomBarcode}>
                              <BarcodeOutlined /> {t('products.barcode')}
                            </Space>
                          }
                          validateStatus={errors.barcode ? 'error' : ''}
                          help={errors.barcode}
                        >
                          <Input
                            placeholder={t('products.barcodePlaceholder')}
                            value={data.barcode}
                            onChange={e => setData('barcode', e.target.value)}
                            autoFocus
                            addonAfter={
                              <Button
                                type="text"
                                icon={<BarcodeOutlined />}
                                onClick={generateRandomBarcode}
                                style={{ border: 'none' }}
                              />
                            }
                          />
                        </Form.Item>

                        <Form.Item
                          label={<Space><TagOutlined /> {t('products.name')}</Space>}
                          validateStatus={errors.name ? 'error' : ''}
                          help={errors.name}
                          required
                        >
                          <Input
                            placeholder={t('products.namePlaceholder')}
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                          />
                        </Form.Item>

                        <Form.Item
                          label={<Space><ShopOutlined /> {t('products.brand')}</Space>}
                          validateStatus={errors.brand ? 'error' : ''}
                          help={errors.brand}
                        >
                          <Input
                            placeholder={t('products.brandPlaceholder')}
                            value={data.brand}
                            onChange={e => setData('brand', e.target.value)}
                          />
                        </Form.Item>

                        <Form.Item
                          label={t('products.category')}
                          validateStatus={errors.category_id ? 'error' : ''}
                          help={errors.category_id}
                          required
                        >
                          <Select
                            placeholder={t('products.categoryPlaceholder')}
                            value={data.category_id}
                            onChange={value => setData('category_id', value)}
                          >
                            {categories.map(category => (
                              <Option key={category.id} value={category.id}>
                                {category.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              label={t('products.pricingStep.batchPrice')}
                              validateStatus={errors.batch_price ? 'error' : ''}
                              help={errors.batch_price}
                              required
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                placeholder={t('products.pricingStep.enterBatchPrice')}
                                value={data.batch_price}
                                onChange={value => setData('batch_price', Number(value || 0))}
                                min={0 as number}
                                addonBefore={t('common.currency')}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={t('products.pricingStep.unitsPerBatch')}
                              validateStatus={errors.units_per_batch ? 'error' : ''}
                              help={errors.units_per_batch}
                              required
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                placeholder={t('products.pricingStep.numberOfUnits')}
                                value={data.units_per_batch}
                                onChange={value => setData('units_per_batch', Number(value || 1))}
                                min={1 as number}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          label={t('products.pricingStep.unitSellingPrice')}
                          validateStatus={errors.price ? 'error' : ''}
                          help={errors.price}
                          required
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder={t('products.pricingStep.enterSellingPricePerUnit')}
                            value={data.price}
                            onChange={value => setData('price', Number(value || 0))}
                            min={0 as number}
                            addonBefore={t('common.currency')}
                          />
                        </Form.Item>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              label={t('products.inventoryStep.currentStock')}
                              validateStatus={errors.stock ? 'error' : ''}
                              help={errors.stock}
                              required
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                placeholder={t('products.inventoryStep.currentQuantityPlaceholder')}
                                value={data.stock}
                                onChange={value => setData('stock', Number(value || 0))}
                                min={0 as number}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={t('products.inventoryStep.reorderLevel')}
                              validateStatus={errors.reorder_level ? 'error' : ''}
                              help={errors.reorder_level}
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                placeholder={t('products.inventoryStep.reorderThresholdPlaceholder')}
                                value={data.reorder_level}
                                onChange={value => setData('reorder_level', Number(value || 0))}
                                min={0 as number}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          label={t('products.inventoryStep.expirationDate')}
                          validateStatus={errors.expiration_date ? 'error' : ''}
                          help={errors.expiration_date}
                        >
                          <DatePicker
                            style={{ width: '100%' }}
                            placeholder={t('products.inventoryStep.selectExpirationDate')}
                            value={data.expiration_date}
                            onChange={date => setData('expiration_date', date)}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <Form.Item label={t('products.imageStep.title')}>
                          <div className="flex items-center">
                            <Upload {...uploadProps} maxCount={1} listType="picture-card">
                              <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>
                                  {t('products.imageStep.upload')}
                                </div>
                              </div>
                            </Upload>
                            {imageUrl && (
                              <div className="ml-4">
                                <img src={imageUrl} alt="Product" style={{ maxHeight: '100px' }} />
                              </div>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className="flex justify-end">
                      <Space>
                        {!editMode && (
                          <Form.Item>
                            <Button
                              type="dashed"
                              htmlType="button"
                              onClick={() => reset()}
                            >
                              {t('common.reset')}
                            </Button>
                          </Form.Item>
                        )}
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            onClick={(e) => submitHandler(e, false)}
                            loading={processing}
                          >
                            {editMode ? t('products.updateProduct') : t('products.addProduct')}
                          </Button>
                        </Form.Item>
                      </Space>
                    </div>
                  </Form>
                </Card>
              );
            };

            export default ProductForm;
