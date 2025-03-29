<?php

namespace App\Http\Controllers;

use App\Models\{Sale, User, Product};
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\{Inertia, Response};
use Illuminate\Routing\Controller as Controller;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display the dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isSupervisor = $user->role === 'supervisor';

        $stats = [
            'todaySales' => $this->getTodaySales($user, $isSupervisor),
            'productsCount' => Product::count(),
            'transactionsCount' => Sale::count(),
        ];

        // Add user count for supervisors
        if ($isSupervisor) {
            $stats['usersCount'] = User::count();
        }

        // Recent sales - limit to user's sales if not supervisor
        $recentSales = $this->getRecentSales($user, $isSupervisor);

        // Low stock and expiring products for supervisors
        $lowStockProducts = [];
        $expiringProducts = [];

        if ($isSupervisor) {
            $lowStockProducts = $this->getLowStockProducts();
            $expiringProducts = $this->getExpiringProducts();
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentSales' => $recentSales,
            'lowStockProducts' => $lowStockProducts,
            'expiringProducts' => $expiringProducts,
        ]);
    }

    /**
     * Get today's sales amount.
     */
    private function getTodaySales(User $user, bool $isSupervisor): float
    {
        $query = Sale::whereDate('created_at', Carbon::today());

        if (!$isSupervisor) {
            $query->where('user_id', $user->id);
        }

        $todaySales = $query->sum('total_amount');

        return $todaySales;
    }

    /**
     * Get recent sales with cashier information.
     */
    private function getRecentSales(User $user, bool $isSupervisor): array
    {
        $query = Sale::with('user')->latest();

        // If not supervisor, only show user's sales
        if (!$isSupervisor) {
            $query->where('user_id', $user->id);
        }

        return $query->take(5)->get()->map(function ($sale) {
            return [
                'id' => $sale->id,
                'transaction_number' => $sale->transaction_number,
                'total_amount' => $sale->total_amount,
                'created_at' => $sale->created_at,
                'cashier_name' => $sale->user ? $sale->user->name : 'Unknown',
            ];
        })->toArray();
    }

    /**
     * Get products with low stock.
     */
    private function getLowStockProducts(): array
    {
        return Product::whereRaw('stock <= reorder_level')
            ->where('stock', '>', 0)
            ->orWhere('stock', 0)
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'stock' => $product->stock,
                    'reorder_level' => $product->reorder_level,
                ];
            })
            ->toArray();
    }

    /**
     * Get products that are expiring soon or already expired.
     */
    private function getExpiringProducts(): array
    {
        $today = Carbon::today();
        $thirtyDaysFromNow = Carbon::today()->addDays(30);

        return Product::whereNotNull('expiration_date')
            ->where(function ($query) use ($today, $thirtyDaysFromNow) {
                $query->whereBetween('expiration_date', [$today, $thirtyDaysFromNow])
                      ->orWhere('expiration_date', '<', $today);
            })
            ->take(5)
            ->get()
            ->map(function ($product) use ($today) {
                $expirationDate = Carbon::parse($product->expiration_date);
                $daysUntilExpiration = $today->diffInDays($expirationDate, false);

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'expiration_date' => $product->expiration_date,
                    'days_until_expiration' => $daysUntilExpiration,
                    'expired' => $daysUntilExpiration < 0,
                ];
            })
            ->toArray();
    }
}
