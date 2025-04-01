import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Typography, InputNumber, Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface CheckoutModalProps {
  visible: boolean;
  total: number;
  amountPaid: number | null;
  change: number;
  onAmountPaidChange: (value: number | null) => void;
  onComplete: () => void;
  onCancel: () => void;
  loading?: boolean;
  onRoundDown?: (originalAmount: number, roundedAmount: number) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  visible,
  total,
  amountPaid,
  change,
  onAmountPaidChange,
  onComplete,
  onCancel,
  loading = false,
  onRoundDown
}) => {
  const { t } = useTranslation();
  const [roundedTotal, setRoundedTotal] = useState<number>(total);
  const [amountForgiven, setAmountForgiven] = useState<number>(0);
  const [isRounded, setIsRounded] = useState<boolean>(false);

  // Reset states when modal becomes visible or total changes
  useEffect(() => {
    setRoundedTotal(total);
    setAmountForgiven(0);
    setIsRounded(false);
  }, [visible, total]);

  const handleRoundDown = () => {
    // Round down to the nearest thousand
    const newRoundedTotal = Math.floor(total / 1000) * 1000;
    const forgiven = total - newRoundedTotal;

    setRoundedTotal(newRoundedTotal);
    setAmountForgiven(forgiven);
    setIsRounded(true);

    if (amountPaid !== null) {
      onAmountPaidChange(amountPaid);
    }

    if (onRoundDown) {
      onRoundDown(total, newRoundedTotal);
    }
  };

  const handleResetAmount = () => {
    setRoundedTotal(total);
    setAmountForgiven(0);
    setIsRounded(false);

    if (amountPaid !== null) {
      onAmountPaidChange(amountPaid);
    }
  };

  const effectiveTotal = isRounded ? roundedTotal : total;

  return (
      <Modal
          title={t('cashier.checkout.title')}
          open={visible}
          onOk={onComplete}
          onCancel={onCancel}
          okText={t('cashier.checkout.completePayment')}
          cancelText={t('common.cancel')}
          confirmLoading={loading}
          okButtonProps={{ disabled: !amountPaid || amountPaid < effectiveTotal || loading }}
      >
          <div style={{ marginBottom: 16 }}>
              <Row>
                  <Col span={12}>
                      <Text strong>{t('cashier.checkout.totalAmount')}:</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong>
                          {t('common.currency')} {Number(effectiveTotal).toLocaleString()}
                          {isRounded && (
                              <Tooltip title={t('cashier.checkout.originalAmount', { amount: Number(total).toLocaleString() })}>
                                  <span style={{ marginLeft: 8, fontSize: 12, color: '#52c41a' }}>
                                      ({t('cashier.checkout.helped')}: {t('common.currency')} {Number(amountForgiven).toLocaleString()})
                                  </span>
                              </Tooltip>
                          )}
                      </Text>
                  </Col>
              </Row>

              <Row style={{ marginTop: 8 }}>
                  <Col span={24} style={{ textAlign: 'right' }}>
                      {!isRounded ? (
                          <Button
                              type="link"
                              onClick={handleRoundDown}
                              disabled={total % 1000 === 0 || loading}
                              style={{ padding: 0 }}
                          >
                              {t('cashier.checkout.roundDown')}
                          </Button>
                      ) : (
                          <Button
                              type="link"
                              onClick={handleResetAmount}
                              disabled={loading}
                              style={{ padding: 0 }}
                          >
                              {t('cashier.checkout.resetAmount')}
                          </Button>
                      )}
                  </Col>
              </Row>

              <Row style={{ marginTop: 16 }}>
                  <Col span={12}>
                      <Text>{t('cashier.checkout.amountPaid')}:</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                      <InputNumber
                          style={{ width: '100%' }}
                          value={amountPaid}
                          onChange={onAmountPaidChange}
                          min={0}
                          precision={0}
                          formatter={(value) => `${t('common.currency')} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => Number(value?.toString().replace(/[^\d]/g, ''))}
                          disabled={loading}
                          autoFocus
                      />
                  </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                  <Col span={12}>
                      <Text strong>{t('cashier.checkout.change')}:</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong style={{ fontSize: 18 }}>
                          {t('common.currency')} {Number(change).toLocaleString()}
                      </Text>
                  </Col>
              </Row>
          </div>
      </Modal>
  );
};

export default CheckoutModal;
