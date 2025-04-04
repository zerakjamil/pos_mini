import React from 'react';
import { Alert, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Paragraph } = Typography;

const FormulaExplanation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Alert
      message={t('reports.formulaExplanation.title')}
      description={
        <Space direction="vertical">
          <Paragraph>
            <strong>{t('reports.formulaExplanation.costOfGoods')}</strong> = {t('reports.formulaExplanation.costOfGoodsFormula')}
          </Paragraph>
          <Paragraph>
            <strong>{t('reports.formulaExplanation.grossProfit')}</strong> = {t('reports.formulaExplanation.grossProfitFormula')}
          </Paragraph>
          <Paragraph>
            <strong>{t('reports.formulaExplanation.profitMargin')}</strong> = {t('reports.formulaExplanation.profitMarginFormula')}
          </Paragraph>
        </Space>
      }
      type="info"
      showIcon
      className="mb-4"
    />
  );
};

export default FormulaExplanation;
