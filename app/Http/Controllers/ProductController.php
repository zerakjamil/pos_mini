<?php

namespace App\Http\Controllers;

use App\Models\{Category, Product, Debtor};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\{Inertia, Response};

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $products = Product::with('category')->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'key' => (string)$product->id,
                'name' => $product->name,
                'price' => $product->price,
                'category' => $product->category ? $product->category->name : 'Uncategorized',
                'stock' => $product->stock,
                'barcode' => $product->barcode ?? '',
                'expiring_soon' => $product->isExpiringSoon(),
                'expired' => $product->isExpired(),
                'days_until_expiration' => $product->days_until_expiration,
                'low_stock' => $product->isLowStock(),
            ];
        });

        $categories = $this->getActiveCategories();

        return Inertia::render('Products/ProductsPage', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }
/**
 * Display the specified product.
 */
public function show(Product $product): Response
{
    $product->load('category');

    $productData = [
        'id' => $product->id,
        'name' => $product->name,
        'price' => $product->price,
        'batch_price' => $product->batch_price,
        'units_per_batch' => $product->units_per_batch,
        'category' => $product->category ? [
            'id' => $product->category->id,
            'name' => $product->category->name,
        ] : null,
        'stock' => $product->stock,
        'barcode' => $product->barcode,
        'reorder_level' => $product->reorder_level,
        'brand' => $product->brand,
        'expiration_date' => $product->expiration_date,
        'days_until_expiration' => $product->days_until_expiration,
        'image_path' => $product->image_path ? Storage::url($product->image_path) : null,
        'is_expiring_soon' => $product->isExpiringSoon(),
        'is_expired' => $product->isExpired(),
        'is_low_stock' => $product->isLowStock(),
    ];

    return Inertia::render('Products/Show', [
        'product' => $productData
    ]);
}
    /**
     * Display the management interface.
     */
    public function cashier(): Response
    {
        $products = Product::with('category')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => (string)$product->id,
                    'key' => (string)$product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'category' => $product->category ? $product->category->name : 'Uncategorized',
                    'stock' => $product->stock,
                    'barcode' => $product->barcode ?? '',
                    'available' => $product->stock > 0,
                    'low_stock' => $product->isLowStock(),
                ];
            });

        // Get debtors with their current balance
        $debtors = Debtor::withSum('debts', 'balance')
            ->orderBy('name')
            ->get()
            ->map(function ($debtor) {
                return [
                    'id' => (string)$debtor->id,
                    'name' => $debtor->name,
                    'phone' => $debtor->phone ?? '',
                    'debts_sum_balance' => (float)($debtor->debts_sum_balance ?? 0), // Ensure it's a number
                ];
            });

        return Inertia::render('CashierSystem', [
            'products' => $products,
            'debtors' => $debtors,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        $categories = $this->getActiveCategories();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for editing a product.
     */
    public function edit(Product $product): Response
    {
        $categories = $this->getActiveCategories();

        $productData = $this->formatProductForForm($product);

        return Inertia::render('Products/Edit', [
            'product' => $productData,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Log::info('Store method called', ['request_data' => $request->all()]);

        try {
            $validated = $this->validateProduct($request);
            $validated = $this->handleImageUpload($request, $validated);

            Product::create($validated);

            Log::info('Product created successfully');
            return Redirect::route('product.index')
                ->with('success', 'Product created successfully.');

        } catch (ValidationException $e) {
            Log::error('Validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Product creation failed', [
                'error' => $e->getMessage(),
            ]);
            return Redirect::back()
                ->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        try {
            $validated = $this->validateProduct($request, $product->id);
            $validated = $this->handleImageUpload($request, $validated, $product);

            $product->update($validated);

            return Redirect::route('product.index')
                ->with('success', 'Product updated successfully.');

        } catch (ValidationException $e) {
            Log::error('Validation failed during update', [
                'errors' => $e->errors(),
                'product_id' => $product->id
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Product update failed', [
                'error' => $e->getMessage(),
                'product_id' => $product->id
            ]);
            return Redirect::back()
                ->with('error', 'Failed to update product: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        try {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }

            $product->delete();

            return Redirect::route('product.index')
                ->with('success', 'Product deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Product deletion failed', [
                'error' => $e->getMessage(),
                'product_id' => $product->id
            ]);
            return Redirect::back()
                ->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }

    /**
     * Validate product input
     */
    private function validateProduct(Request $request, ?int $productId = null): array
    {
        $barcodeRule = 'nullable|string|max:255';
        if (!$productId) {
            $barcodeRule .= '|unique:products,barcode';
        } else {
            $barcodeRule .= '|unique:products,barcode,' . $productId;
        }

        return $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'barcode' => $barcodeRule,
            'reorder_level' => 'nullable|integer|min:0',
            'brand' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'expiration_date' => 'nullable|date',
            'batch_price' => 'required|numeric|min:0',
            'units_per_batch' => 'required|integer|min:1',
        ]);
    }

    /**
     * Handle image upload for product
     */
    private function handleImageUpload(Request $request, array $validated, ?Product $product = null): array
    {
        if ($request->hasFile('image')) {
            Log::info('Processing image upload');

            // Delete old image if updating
            if ($product && $product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }

            try {
                $imagePath = $request->file('image')->store('products', 'public');
                $validated['image_path'] = $imagePath;
                Log::info('Image stored successfully', ['path' => $imagePath]);
            } catch (\Exception $e) {
                Log::error('Image upload failed', [
                    'error' => $e->getMessage()
                ]);
                throw $e;
            }
        }

        return $validated;
    }

    /**
     * Format product data for form display
     */
    private function formatProductForForm(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'batch_price' => $product->batch_price,
            'units_per_batch' => $product->units_per_batch,
            'category_id' => $product->category_id,
            'stock' => $product->stock,
            'barcode' => $product->barcode,
            'reorder_level' => $product->reorder_level,
            'brand' => $product->brand,
            'expiration_date' => $product->expiration_date,
            'image_path' => $product->image_path ? Storage::url($product->image_path) : null,
        ];
    }

    /**
     * Get active categories
     */
    private function getActiveCategories(): array
    {
        return Category::where('active', true)->get(['id', 'name'])->toArray();
    }
}
