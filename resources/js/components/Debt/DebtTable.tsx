import { Card, Table } from 'antd';

interface DebtTableProps {
    debts: Debt[];
    columns: ColumnType[];
}

function DebtTable({ debts, columns }: DebtTableProps) {
    return (
        <Card>
            <Table
                dataSource={debts}
                columns={columns}
                rowKey="id"
                pagination={false}
                locale={{
                    emptyText: 'No debts found'
                }}
            />
        </Card>
    );
}
export default DebtTable;
