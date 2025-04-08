import { useState } from 'react';
import { ProfitData, SummaryData } from '../types/types';

export const useReportData = (dailyProfits: ProfitData[], weeklyProfits: ProfitData[], monthlyProfits: ProfitData[]) => {
  const [activeTab, setActiveTab] = useState<string>('daily');

  const getActiveData = (): ProfitData[] => {
    switch (activeTab) {
      case 'daily':
        return dailyProfits;
      case 'weekly':
        return weeklyProfits;
      case 'monthly':
        return monthlyProfits;
      default:
        return dailyProfits;
    }
  };

  const calculateSummary = (data: ProfitData[]): SummaryData => {
    const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
    const totalCost = data.reduce((sum, item) => sum + item.cost_of_goods, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.gross_profit, 0);
    const avgMargin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;

    return { totalRevenue, totalCost, totalProfit, avgMargin };
  };

  const summary = calculateSummary(getActiveData());

  return {
    activeTab,
    setActiveTab,
    getActiveData,
    summary,
  };
};
