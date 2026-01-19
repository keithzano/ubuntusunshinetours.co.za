<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiscountCode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiscountController extends Controller
{
    public function index(): Response
    {
        $discounts = DiscountCode::latest()->paginate(20);

        return Inertia::render('admin/discounts/index', [
            'discounts' => $discounts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/discounts/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:discount_codes,code',
            'description' => 'nullable|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'per_user_limit' => 'nullable|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);

        DiscountCode::create($validated);

        return back()->with('success', 'Discount code created');
    }

    public function update(Request $request, DiscountCode $discount)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:discount_codes,code,' . $discount->id,
            'description' => 'nullable|string|max:255',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'per_user_limit' => 'nullable|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);

        $discount->update($validated);

        return back()->with('success', 'Discount code updated');
    }

    public function destroy(DiscountCode $discount)
    {
        $discount->delete();

        return back()->with('success', 'Discount code deleted');
    }

    public function toggleStatus(DiscountCode $discount)
    {
        $discount->update(['is_active' => !$discount->is_active]);

        return back()->with('success', 'Discount status updated');
    }
}
