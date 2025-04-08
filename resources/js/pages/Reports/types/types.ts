export interface ProfitData {
  date: string;
  sales_count: number;
  total_revenue: number;
  cost_of_goods: number;
  gross_profit: number;
  profit_margin: number;
}

export interface SummaryData {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  avgMargin: number;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}
