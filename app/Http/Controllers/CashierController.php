<?php

namespace App\Http\Controllers;

use App\Models\Cashier;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class CashierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cashiers = Cashier::with('user')->latest()->get();

        return Inertia::render('Cashiers/Index', [
            'cashiers' => $cashiers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Cashiers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Create user first
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'cashier', // Changed from 'management' to 'cashier'
        ]);

        // Create cashier record
        $cashier = Cashier::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => 'active',
            'user_id' => $user->id,
        ]);

        return redirect()->route('cashiers-management.index')
            ->with('success', 'Cashier created successfully.');
    }

    /**
     * Display the specified resource.
     */
 public function show($id)
 {
     $cashier = Cashier::with('user')->findOrFail($id);
     return Inertia::render('Cashiers/Show', [
         'cashier' => $cashier,
     ]);
 }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $cashier = Cashier::with('user')->findOrFail($id);
        return Inertia::render('Cashiers/Edit', [
            'cashier' => $cashier,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cashier = Cashier::with('user')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $cashier->user_id,
            'phone' => 'nullable|string|max:20',
            'status' => 'required|in:active,inactive',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = $cashier->user;
        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        $cashier->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => $request->status,
        ]);

        return redirect()->route('cashiers-management.index')
            ->with('success', 'Cashier updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cashier = Cashier::with('user')->findOrFail($id);
        $cashier->user->delete();

        return redirect()->route('cashiers-management.index')
            ->with('success', 'Cashier deleted successfully.');
    }
}
