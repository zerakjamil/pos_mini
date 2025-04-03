<?php

namespace App\Http\Controllers;

use App\Models\CardDebt;
use App\Models\CardType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CardTypeController extends Controller
{
    public function index()
    {
        $cardTypes = CardType::all();

        return Inertia::render('CardTypes/Index', [
            'cardTypes' => $cardTypes
        ]);
    }

    public function show(CardType $cardType){
        return Inertia::render('CardTypes/Show', [
            'cardType' => $cardType
        ]);
    }
    public function create()
    {
        return Inertia::render('CardTypes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:card_types',
            'description' => 'nullable|string',
        ]);

        $cardType = CardType::create($validated);

        return redirect()->route('card-types.index')
            ->with('success', 'Card type created successfully');
    }

    public function edit(CardType $cardType)
    {
        return Inertia::render('CardTypes/Edit', [
            'cardType' => $cardType
        ]);
    }

    public function update(Request $request, CardType $cardType)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:card_types,name,' . $cardType->id,
            'description' => 'nullable|string',
        ]);

        $cardType->update($validated);

        return redirect()->route('card-types.index')
            ->with('success', 'Card type updated successfully');
    }

    public function destroy(CardType $cardType)
    {
        $isInUse = CardDebt::where('card_type', $cardType->name)->exists();

        if ($isInUse) {
            return redirect()->route('card-types.index')
                ->with('error', 'Cannot delete card type because it is in use');
        }

        $cardType->delete();

        return redirect()->route('card-types.index')
            ->with('success', 'Card type deleted successfully');
    }
}
