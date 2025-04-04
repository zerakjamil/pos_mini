import { Table } from 'antd';
import { useTranslation } from 'react-i18next';

interface CardDebtTableProps {
  cardDebts: any[];
  columns: any[];
}

export default function CardDebtTable({ cardDebts, columns }: CardDebtTableProps) {
  const { t } = useTranslation();

  return (
    <Table
      dataSource={cardDebts}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
      }}
      locale={{
        emptyText: t('cardDebts.noCategoryDebtsFound')
      }}
    />
  );
}
