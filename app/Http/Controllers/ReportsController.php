<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        return Inertia::render('Reports/Index', [
            'dailyProfits' => $this->getDailyProfits($startDate, $endDate),
            'weeklyProfits' => $this->getWeeklyProfits($startDate, $endDate),
            'monthlyProfits' => $this->getMonthlyProfits(),
        ]);
    }

    private function getDailyProfits($startDate, $endDate)
    {
        return DB::table('sales')
            ->join('sale_items', 'sales.id', '=', 'sale_items.sale_id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate . ' 23:59:59'])
            ->select(
                DB::raw('DATE(sales.created_at) as date'),
                DB::raw('COUNT(DISTINCT sales.id) as sales_count'),
                DB::raw('SUM(sales.total_amount) as total_revenue'),
                DB::raw('SUM(sale_items.quantity * products.batch_price / products.units_per_batch) as cost_of_goods'),
                DB::raw('SUM(sales.total_amount) - SUM(sale_items.quantity * products.batch_price / products.units_per_batch) as gross_profit'),
                DB::raw('(SUM(sales.total_amount) - SUM(sale_items.quantity * products.batch_price / products.units_per_batch)) / SUM(sales.total_amount) as profit_margin')
            )
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();
    }

    private function getWeeklyProfits($startDate, $endDate)
    {
        return DB::table('sales')
            ->join('sale_items', 'sales.id', '=', 'sale_items.sale_id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate . ' 23:59:59'])
            ->select(
                DB::raw('YEAR(sales.created_at) as year'),
                DB::raw('WEEK(sales.created_at) as week'),
                DB::raw('MIN(DATE(sales.created_at)) as start_date'),
                DB::raw('MAX(DATE(sales.created_at)) as end_date'),
                DB::raw('COUNT(DISTINCT sales.id) as sales_count'),
                DB::raw('SUM(sales.total_amount) as total_revenue'),
                DB::raw('SUM(sale_items.quantity * products.batch_price / products.units_per_batch) as cost_of_goods'),
                DB::raw('SUM(sales.total_amount) - SUM(sale_items.quantity * products.batch_price / products.units_per_batch) as gross_profit'),
                DB::raw('(SUM(sales.total_amount) - SUM(sale_items.quantity * products.batch_price / products.units_per_batch)) / SUM(sales.total_amount) as profit_margin')
            )
            ->groupBy('year', 'week')
            ->orderBy('year', 'desc')
            ->orderBy('week', 'desc')
            ->get()
            ->map(function($item) {
                $item->date = "Week {$item->week} ({$item->start_date} to {$item->end_date})";
                unset($item->year);
                unset($item->week);
                unset($item->start_date);
                unset($item->end_date);
                return $item;
            });
    }

    private function getMonthlyProfits()
    {
        return DB::table('sales')
            ->join('sale_items', 'sales.id', '=', 'sale_items.sale_id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->select(
                DB::raw('DATE_FORMAT(sales.created_at, "%Y-%m") as date'),
                DB::raw('DATE_FORMAT(sales.created_at, "%b %Y") as month_name'),
                DB::raw('COUNT(DISTINCT sales.id) as sales_count'),
                DB::raw('SUM(sales.total_amount) as total_revenue'),
                DB::raw('SUM(sale_items.quantity * products.batch_price / products.units_per_batch) as cost_of_goods'),
                DB::raw('SUM(sales.total_amount) - SUM(sale_items.quantity * products.batch_price / products.units_per_batch) as gross_profit'),
                DB::raw('(SUM(sales.total_amount) - SUM(sale_items.quantity * products.batch_price / products.units_per_batch)) / SUM(sales.total_amount) as profit_margin')
            )
            ->where('sales.created_at', '>=', now()->subMonths(12))
            ->groupBy('date', 'month_name')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function($item) {
                $item->date = $item->month_name;
                unset($item->month_name);
                return $item;
            });
    }
}
