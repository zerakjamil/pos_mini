// resources/js/Pages/Debtors/Edit.tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Popconfirm,
  message
} from 'antd';
import { Trash } from 'lucide-react';

const { Title } = Typography;
const { TextArea } = Input;

interface Debtor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface Props {
  debtor: Debtor;
}

// Add index signature to satisfy FormDataType constraint
interface DebtorForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  [key: string]: string;
}

export default function Edit({ debtor }: Props) {
  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Debtors', href: route('debtors.index') },
    { title: debtor.name, href: route('debtors.show', debtor.id) },
    { title: 'Edit', href: route('debtors.edit', debtor.id) }
  ];

  const { data, setData, put, delete: destroy, processing, errors } = useForm<DebtorForm>({
    name: debtor.name || '',
    email: debtor.email || '',
    phone: debtor.phone || '',
    address: debtor.address || '',
    notes: debtor.notes || '',
  });

  const handleSubmit = () => {
    put(route('debtors.update', debtor.id), {
      onSuccess: () => {
        message.success('Debtor updated successfully');
      }
    });
  };

  const handleDelete = () => {
    destroy(route('debtors.destroy', debtor.id), {
      onSuccess: () => {
        message.success('Debtor deleted successfully');
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Debtor - ${debtor.name}`} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>Edit Debtor: {debtor.name}</Title>
          <Popconfirm
            title="Delete debtor"
            description="Are you sure you want to delete this debtor and all associated debts?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash size={16} />}>Delete Debtor</Button>
          </Popconfirm>
        </div>

        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              name: data.name,
              email: data.email,
              phone: data.phone,
              address: data.address,
              notes: data.notes,
            }}
          >
            <Form.Item
              label="Name"
              required
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name}
            >
              <Input
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email}
            >
              <Input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Phone"
              validateStatus={errors.phone ? 'error' : ''}
              help={errors.phone}
            >
              <Input
                value={data.phone}
                onChange={e => setData('phone', e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Address"
              validateStatus={errors.address ? 'error' : ''}
              help={errors.address}
            >
              <TextArea
                rows={3}
                value={data.address}
                onChange={e => setData('address', e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Notes"
              validateStatus={errors.notes ? 'error' : ''}
              help={errors.notes}
            >
              <TextArea
                rows={3}
                value={data.notes}
                onChange={e => setData('notes', e.target.value)}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href={route('debtors.show', debtor.id)}>
                <Button>Cancel</Button>
              </Link>
              <Button type="primary" htmlType="submit" loading={processing}>
                Update Debtor
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
