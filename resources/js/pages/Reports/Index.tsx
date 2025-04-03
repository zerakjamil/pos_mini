import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, Divider, Tabs } from 'antd';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProfitData } from './types/types';
import { useTranslation } from 'react-i18next';

import ReportHeader from './components/ReportHeader';
import ReportTable from './components/ReportTable';
import ReportSummary from './components/ReportSummary';
import FormulaExplanation from './components/FormulaExplanation';

import { useReportData } from './hooks/useReportData';
import { usePrintReport } from './hooks/usePrintReport';

const { TabPane } = Tabs;

interface ReportProps {
  dailyProfits: ProfitData[];
  weeklyProfits: ProfitData[];
  monthlyProfits: ProfitData[];
}

const ReportsPage: React.FC<ReportProps> = ({ dailyProfits, weeklyProfits, monthlyProfits }) => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab, getActiveData, summary } = useReportData(
    dailyProfits,
    weeklyProfits,
    monthlyProfits
  );

  const { printReport } = usePrintReport();

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('dashboard.title'), href: route('dashboard') },
    { title: t('reports.title'), href: route('reports.index') },
  ];

  const handlePrint = () => {
    printReport(activeTab, getActiveData());
  };

  const renderTabContent = (data: ProfitData[]) => (
    <>
      <ReportTable data={data} summary={summary} />
      <Divider />
      <ReportSummary summary={summary} />
    </>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('reports.salesReports')} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <ReportHeader onPrint={handlePrint} />

        <Card>
          <FormulaExplanation />

          <Tabs defaultActiveKey="daily" onChange={(key) => setActiveTab(key as string)}>
            <TabPane tab={t('reports.tabs.daily')} key="daily">
              {renderTabContent(dailyProfits)}
            </TabPane>
            <TabPane tab={t('reports.tabs.weekly')} key="weekly">
              {renderTabContent(weeklyProfits)}
            </TabPane>
            <TabPane tab={t('reports.tabs.monthly')} key="monthly">
              {renderTabContent(monthlyProfits)}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
