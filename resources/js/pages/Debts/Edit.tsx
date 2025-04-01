import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  InputNumber,
  Typography,
  message,
  Popconfirm
} from 'antd';
import { Trash } from 'lucide-react';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface DebtForm {
  debtor_id: number;
  amount: number;
  description: string;
  due_date: string;
}

export default function Edit({ debt, debtors }) {
  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Debts', href: route('debts.index') },
    { title: debt.description, href: route('debts.show', debt.id) },
    { title: 'Edit', href: route('debts.edit', debt.id) }
  ];

  const { data, setData, put, delete: destroy, processing, errors } = useForm<DebtForm>({
    debtor_id: debt.debtor_id,
    amount: debt.amount,
    description: debt.description,
    due_date: debt.due_date,
  });

  const handleSubmit = () => {
    put(route('debts.update', debt.id), {
      onSuccess: () => {
        message.success('Debt updated successfully');
      }
    });
  };

  const handleDelete = () => {
    destroy(route('debts.destroy', debt.id), {
      onSuccess: () => {
        message.success('Debt deleted successfully');
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Debt - ${debt.description}`} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>Edit Debt</Title>
          <Popconfirm
            title="Delete debt"
            description="Are you sure you want to delete this debt?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash size={16} />}>Delete Debt</Button>
          </Popconfirm>
        </div>

        <Card>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              debtor_id: data.debtor_id,
              amount: data.amount,
              description: data.description,
              due_date: data.due_date ? dayjs(data.due_date) : null,
            }}
          >
            <Form.Item
              label="Debtor"
              required
              validateStatus={errors.debtor_id ? 'error' : ''}
              help={errors.debtor_id}
            >
              <Select
                placeholder="Select a debtor"
                value={data.debtor_id}
                onChange={(value) => setData('debtor_id', value)}
                showSearch
                optionFilterProp="children"
              >
                {debtors.map(debtor => (
                  <Option key={debtor.id} value={debtor.id}>{debtor.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Amount"
              required
              validateStatus={errors.amount ? 'error' : ''}
              help={errors.amount}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    value={data.amount}
                    onChange={(value) => setData('amount', value as number)}
                    placeholder="Enter debt amount"
                    min={0}
                    addonBefore="IQD"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/IQD\s?|(,*)/g, '')}
                />
            </Form.Item>

            <Form.Item
              label="Description"
              required
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description}
            >
              <TextArea
                rows={3}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Enter debt description"
              />
            </Form.Item>

            <Form.Item
              label="Due Date"
              required
              validateStatus={errors.due_date ? 'error' : ''}
              help={errors.due_date}
            >
              <DatePicker
                style={{ width: '100%' }}
                value={data.due_date ? dayjs(data.due_date) : null}
                onChange={(date) => setData('due_date', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href={route('debts.show', debt.id)}>
                <Button>Cancel</Button>
              </Link>
              <Button type="primary" htmlType="submit" loading={processing}>
                Update Debt
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
