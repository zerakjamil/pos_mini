<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $products = [
            [
                'key' => '1',
                'name' => 'Laptop Pro',
                'price' => 1299.99,
                'category' => 'Electronics',
                'stock' => 45,
                'barcode' => '8693029708983', // EAN-13 format
            ],
            [
                'key' => '2',
                'name' => 'Wireless Headphones',
                'price' => 199.99,
                'category' => 'Electronics',
                'stock' => 120,
                'barcode' => '7501234567891', // EAN-13 format
            ],
            [
                'key' => '3',
                'name' => 'Coffee Maker',
                'price' => 89.99,
                'category' => 'Kitchen',
                'stock' => 30,
                'barcode' => '0123456789012', // UPC-A format
            ],
            [
                'key' => '4',
                'name' => 'Fitness Tracker',
                'price' => 129.99,
                'category' => 'Wearables',
                'stock' => 75,
                'barcode' => '6901234567893', // EAN-13 format
            ],
            [
                'key' => '5',
                'name' => 'Smart Speaker',
                'price' => 149.99,
                'category' => 'Electronics',
                'stock' => 60,
                'barcode' => '0987654321098', // UPC-A format
            ],
            [
                'key' => '6',
                'name' => 'Blender',
                'price' => 79.99,
                'category' => 'Kitchen',
                'stock' => 25,
                'barcode' => '8693029702950', // EAN-13 format
            ]
        ];

        $categories = array_unique(array_column($products, 'category'));

        return Inertia::render('DashboardProducts', [
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        // Handle file upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = $path;
        }

        // In a real application, you would save the product to the database here
        // For now, we'll just return a success response

        return redirect()->route('products.index')->with('success', 'Product added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
