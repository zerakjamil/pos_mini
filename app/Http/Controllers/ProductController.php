<?php

namespace App\Http\Controllers;

use App\Models\{Category, Product};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\{Inertia, Response};
use Illuminate\Routing\Controller as Controller;

class ProductController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:supervisor')->only(['create', 'store', 'edit', 'update', 'destroy']);
    }
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
                'price' => $product->price / 100,
                'category' => $product->category ? $product->category->name : 'Uncategorized',
                'stock' => $product->stock,
                'barcode' => $product->barcode ?? '',
                'expiring_soon' => $product->isExpiringSoon(),
                'expired' => $product->isExpired(),
                'days_until_expiration' => $product->days_until_expiration,
                'low_stock' => $product->isLowStock(),
            ];
        });

        $categories = Category::where('active', true)->pluck('name');

        return Inertia::render('Products/ProductsPage', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
 * Display the cashier interface.
 */
public function cashier(): Response
{
    $products = [
        [
            'id' => '1',
            'key' => '1',
            'name' => 'Laptop Pro',
            'price' => 1299.99,
            'category' => 'Electronics',
            'stock' => 45,
            'barcode' => '8693029702950', // EAN-13 format
        ],
        [
            'id' => '2',
            'key' => '2',
            'name' => 'Wireless Headphones',
            'price' => 199.99,
            'category' => 'Electronics',
            'stock' => 120,
            'barcode' => '7501234567891', // EAN-13 format
        ],
        [
            'id' => '3',
            'key' => '3',
            'name' => 'Coffee Maker',
            'price' => 89.99,
            'category' => 'Kitchen',
            'stock' => 30,
            'barcode' => '0123456789012', // UPC-A format
        ],
        [
            'id' => '4',
            'key' => '4',
            'name' => 'Fitness Tracker',
            'price' => 129.99,
            'category' => 'Wearables',
            'stock' => 75,
            'barcode' => '6901234567893', // EAN-13 format
        ],
        [
            'id' => '5',
            'key' => '5',
            'name' => 'Smart Speaker',
            'price' => 149.99,
            'category' => 'Electronics',
            'stock' => 60,
            'barcode' => '0987654321098', // UPC-A format
        ],
        [
            'id' => '6',
            'key' => '6',
            'name' => 'Blender',
            'price' => 79.99,
            'category' => 'Kitchen',
            'stock' => 25,
            'barcode' => '8681038207009', // EAN-13 format
        ]
    ];

    return Inertia::render('CashierSystem', [
        'products' => $products,
    ]);
}

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        $categories = Category::where('active', true)->get();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
/**
 * Store a newly created resource in storage.
 */
public function store(Request $request)
{
    $user = auth()->user();

    // Only supervisors can add products
    if (!$user->isSupervisor()) {
        return redirect()->route('products.index')
            ->with('error', 'You do not have permission to add products.');
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'category_id' => 'required|exists:categories,id',
        'stock' => 'required|integer|min:0',
        'barcode' => 'nullable|string|max:255|unique:products,barcode',
        'reorder_level' => 'nullable|integer|min:0',
        'brand' => 'nullable|string|max:255',
        'image' => 'nullable|image|max:2048',
        'expiration_date' => 'nullable|date|after:today',
    ]);

    // Handle image upload if present
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('products', 'public');
        $validated['image_path'] = $imagePath;
    }

    // Convert price to cents for storage
    $validated['price'] = $validated['price'] * 100;

    // Create the product
    $product = Product::create($validated);

    return redirect()->route('products.index')
        ->with('success', 'Product created successfully.');
}

/**
 * Update the specified resource in storage.
 */
public function update(Request $request, Product $product)
{
    $user = auth()->user();

    // Only supervisors can update products
    if (!$user->isSupervisor()) {
        return response()->json(['error' => 'You do not have permission to update products.'], 403);
    }

   $validated = $request->validate([
       'name' => 'required|string|max:255',
       'price' => 'required|numeric|min:0',
       'batch_price' => 'required|numeric|min:0',
       'units_per_batch' => 'required|integer|min:1',
        'category_id' => 'required|exists:categories,id',
       'stock' => 'required|integer|min:0',
       'reorder_level' => 'nullable|integer|min:0',
       'image' => 'nullable|image|max:2048',
       'expiration_date' => 'nullable|date',
   ]);

    if ($validated->fails()) {
        return response()->json(['errors' => $validated->errors()], 422);
    }

    // Handle image upload if present
    if ($request->hasFile('image')) {
        // Delete old image if exists
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $imagePath = $request->file('image')->store('products', 'public');
        $validated['image_path'] = $imagePath;
    }

    // Convert price to cents for storage
    $validated['price'] = $validated['price'] * 100;

    // Update the product
    $product->update($validated);

    return redirect()->route('products.index')
        ->with('success', 'Product updated successfully.');
}

/**
 * Remove the specified resource from storage.
 */
public function destroy(Product $product)
{
    $user = auth()->user();

    // Only supervisors can delete products
    if (!$user->isSupervisor()) {
        return redirect()->route('products.index')
            ->with('error', 'You do not have permission to delete products.');
    }

    // Delete the product image if exists
    if ($product->image_path) {
        Storage::disk('public')->delete($product->image_path);
    }

    $product->delete();

    return redirect()->route('products.index')
        ->with('success', 'Product deleted successfully.');
}
}
