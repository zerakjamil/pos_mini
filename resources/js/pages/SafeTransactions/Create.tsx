import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Form, Input, Button, Select, InputNumber, Card, Radio } from 'antd';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from 'react-i18next';

interface Account {
  account_number: string;
  owner_name: string;
  balance: number;
}

interface Props {
  accounts: Account[];
}

export default function Create({ accounts }: Props) {
  const { t } = useTranslation();
  const [transactionType, setTransactionType] = useState('from_safe');
  const [selectedSender, setSelectedSender] = useState<Account | null>(null);
  
  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('safeTransactions.title'), href: route('safe-transactions.index') },
    { title: t('safeTransactions.create'), href: route('safe-transactions.create') }
  ];
  
  const { data, setData, post, processing, errors } = useForm({
    sender_account: '',
    receiver_account: '',
    amount: 0,
    source_safe: 'main',
    description: '',
  });
  
  const handleSenderChange = (value: string) => {
    setData('sender_account', value);
    setSelectedSender(accounts.find(acc => acc.account_number === value) || null);
  };
  
  const handleTransactionTypeChange = (e) => {
    const type = e.target.value;
    setTransactionType(type);
    setData('sender_account', type === 'from_safe' ? '' : data.sender_account);
  };
  
  const handleSubmit = () => {
    post(route('safe-transactions.store'));
  };
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('safeTransactions.create')} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t('safeTransactions.create')}</h1>
      </div>
      
      <Card>
        <Form layout="vertical" onFinish={handleSubmit}>
          <div className="mb-6">
            <Radio.Group 
              value={transactionType} 
              onChange={handleTransactionTypeChange}
              className="mb-4"
            >
              <Radio.Button value="from_safe">{t('safeTransactions.fromSafe')}</Radio.Button>
              <Radio.Button value="between_accounts">{t('safeTransactions.betweenAccounts')}</Radio.Button>
            </Radio.Group>
          </div>
          
          {transactionType === 'between_accounts' && (
            <Form.Item 
              label={t('safeTransactions.senderAccount')} 
              required 
              validateStatus={errors.sender_account ? 'error' : ''} 
              help={errors.sender_account}
            >
              <Select
                showSearch
                value={data.sender_account}
                onChange={handleSenderChange}
                placeholder={t('safeTransactions.selectSender')}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {accounts.map((account) => (
                  <Select.Option key={account.account_number} value={account.account_number}>
                    {account.account_number} - {account.owner_name} (Balance: IQD {account.balance.toLocaleString()})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          
          <Form.Item 
            label={t('safeTransactions.receiverAccount')} 
            required 
            validateStatus={errors.receiver_account ? 'error' : ''} 
            help={errors.receiver_account}
          >
            <Select
              showSearch
              value={data.receiver_account}
              onChange={(value) => setData('receiver_account', value)}
              placeholder={t('safeTransactions.selectReceiver')}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {accounts.map((account) => (
                <Select.Option 
                  key={account.account_number} 
                  value={account.account_number}
                  disabled={account.account_number === data.sender_account}
                >
                  {account.account_number} - {account.owner_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            label={t('safeTransactions.amount')} 
            required 
            validateStatus={errors.amount ? 'error' : ''} 
            help={errors.amount}
          >
            <InputNumber
              style={{ width: '100%' }}
              value={data.amount}
              onChange={(value) => setData('amount', Number(value))}
              min={1}
              step={1000}
              formatter={(value) => `IQD ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/IQD\s?|(,*)/g, '')}
            />
            {selectedSender && transactionType === 'between_accounts' && (
              <div className="text-sm mt-1">
                {selectedSender.balance < data.amount ? (
                  <span className="text-red-500">
                    {t('safeTransactions.insufficientFunds')}
                  </span>
                ) : (
                  <span className="text-green-500">
                    {t('safeTransactions.sufficientFunds')}
                  </span>
                )}
              </div>
            )}
          </Form.Item>
          
          {transactionType === 'from_safe' && (
            <Form.Item 
              label={t('safeTransactions.sourceSafe')} 
              required 
              validateStatus={errors.source_safe ? 'error' : ''} 
              help={errors.source_safe}
            >
              <Radio.Group
                value={data.source_safe}
                onChange={(e) => setData('source_safe', e.target.value)}
              >
                <Radio value="main">{t('safeTransactions.mainSafe')}</Radio>
                <Radio value="secondary">{t('safeTransactions.secondarySafe')}</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          
          <Form.Item 
            label={t('safeTransactions.description')}
            validateStatus={errors.description ? 'error' : ''} 
            help={errors.description}
          >
            <Input.TextArea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows={3}
              placeholder={t('safeTransactions.descriptionPlaceholder')}
            />
          </Form.Item>
          
          <div className="flex justify-end">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={processing}
              disabled={transactionType === 'between_accounts' && selectedSender && selectedSender.balance < data.amount}
            >
              {t('safeTransactions.submit')}
            </Button>
          </div>
        </Form>
      </Card>
    </AppLayout>
  );
}