import { Card, Form, Input, Button, Typography } from 'antd';
import { useForm } from '@inertiajs/react';

const { TextArea } = Input;
const { Title } = Typography;

interface FormProps {
  debtor?: any;
  isEditing?: boolean;
}

export function DebtorForm({ debtor, isEditing = false }: FormProps) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: debtor?.name || '',
    email: debtor?.email || '',
    phone: debtor?.phone || '',
    address: debtor?.address || '',
    notes: debtor?.notes || '',
  });

  function handleSubmit() {
    if (isEditing) {
      put(route('debtors.update', debtor.id));
    } else {
      post(route('debtors.store'));
    }
  }

  return (
    <Card>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Title level={4}>{isEditing ? 'Edit Debtor' : 'Add New Debtor'}</Title>

        <Form.Item
          label="Name"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name}
        >
          <Input
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            placeholder="Enter debtor's name"
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
            placeholder="Email address (optional)"
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
            placeholder="Phone number (optional)"
          />
        </Form.Item>

        <Form.Item
          label="Address"
          validateStatus={errors.address ? 'error' : ''}
          help={errors.address}
        >
          <TextArea
            value={data.address}
            onChange={e => setData('address', e.target.value)}
            placeholder="Address (optional)"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          label="Notes"
          validateStatus={errors.notes ? 'error' : ''}
          help={errors.notes}
        >
          <TextArea
            value={data.notes}
            onChange={e => setData('notes', e.target.value)}
            placeholder="Additional notes (optional)"
            rows={3}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={processing}>
            {isEditing ? 'Update Debtor' : 'Save Debtor'}
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
