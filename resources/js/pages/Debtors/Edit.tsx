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
import { useTranslation } from 'react-i18next';

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

interface DebtorForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  [key: string]: string;
}

export default function Edit({ debtor }: Props) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('debtors.title'), href: route('debtors.index') },
    { title: debtor.name, href: route('debtors.show', debtor.id) },
    { title: t('common.edit'), href: route('debtors.edit', debtor.id) }
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
        message.success(t('debtors.updateSuccess'));
      }
    });
  };

  const handleDelete = () => {
    destroy(route('debtors.destroy', debtor.id), {
      onSuccess: () => {
        message.success(t('debtors.deleteSuccess'));
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('debtors.editTitle', { name: debtor.name })} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('debtors.editDebtor', { name: debtor.name })}</Title>
          <Popconfirm
            title={t('debtors.deleteConfirmTitle')}
            description={t('debtors.deleteConfirmDescription')}
            onConfirm={handleDelete}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash size={16} />}>{t('debtors.deleteDebtor')}</Button>
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
              label={t('debtors.name')}
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
              label={t('debtors.phone')}
              validateStatus={errors.phone ? 'error' : ''}
              help={errors.phone}
            >
              <Input
                value={data.phone}
                onChange={e => setData('phone', e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={t('debtors.notes')}
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
                <Button>{t('common.cancel')}</Button>
              </Link>
              <Button type="primary" htmlType="submit" loading={processing}>
                {t('debtors.updateDebtor')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
