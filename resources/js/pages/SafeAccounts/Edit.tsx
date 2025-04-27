import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Form, Input, InputNumber } from 'antd';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { SafeAccount } from '@/types/safe';

interface EditProps {
    account: SafeAccount;
}

const Edit: React.FC<EditProps> = ({ account }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        router.put(route('safe-accounts.update', account.id), values);
    };

    return (
        <AppLayout>
            <Head title={t('safe.editAccount')} />
            
            <div className="container p-6">
                <PageHeader
                    title={t('safe.editAccount')}
                    breadcrumbItems={[
                        { title: t('sidebar.dashboard'), href: route('dashboard') },
                        { title: t('safe.accounts'), href: route('safe-accounts.index') },
                        { title: t('safe.editAccount'), href: route('safe-accounts.edit', account.id) },
                    ]}
                    actions={
                        <Link href={route('safe-accounts.index')}>
                            <Button icon={<ArrowLeft size={16} />}>
                                {t('common.back')}
                            </Button>
                        </Link>
                    }
                />

                <Card className="mt-4 max-w-2xl mx-auto">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            name: account.name,
                            description: account.description,
                            balance: account.balance
                        }}
                    >
                        <Form.Item
                            name="name"
                            label={t('safe.accountName')}
                            rules={[{ required: true, message: t('safe.nameRequired') }]}
                        >
                            <Input placeholder={t('safe.enterAccountName')} />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={t('safe.description')}
                        >
                            <Input.TextArea 
                                rows={3} 
                                placeholder={t('safe.enterDescription')} 
                            />
                        </Form.Item>

                        <Form.Item
                            name="balance"
                            label={t('safe.balance')}
                            rules={[
                                { required: true, message: t('safe.balanceRequired') },
                                { type: 'number', min: 0, message: t('safe.balancePositive') }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item>
                            <div className="flex justify-end space-x-2">
                                <Link href={route('safe-accounts.index')}>
                                    <Button>{t('common.cancel')}</Button>
                                </Link>
                                <Button type="primary" htmlType="submit">
                                    {t('common.save')}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Edit;
