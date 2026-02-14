<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Tour;
use App\Models\TourTimeSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $cart = $this->getCart();
        $cart->load(['items.tour.category', 'items.tour.location', 'items.timeSlot']);

        return Inertia::render('cart/index', [
            'cart' => $cart,
            'items' => $cart->items,
            'total' => $cart->total,
        ]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'tour_id' => 'required|exists:tours,id',
            'tour_date' => 'required|date|after_or_equal:today',
            'tour_time' => 'nullable|date_format:H:i',
            'time_slot_id' => 'nullable|exists:tour_time_slots,id',
            'participants' => 'required|array|min:1',
            'participants.*.tier_id' => 'required|exists:tour_pricing_tiers,id',
            'participants.*.name' => 'required|string',
            'participants.*.quantity' => 'required|integer|min:0',
            'participants.*.price' => 'required|numeric|min:0',
        ]);

        $tour = Tour::findOrFail($validated['tour_id']);
        $cart = $this->getCart();

        // Calculate total participants
        $totalParticipants = collect($validated['participants'])
            ->sum('quantity');

        // Validate minimum participants requirement
        if ($tour->min_participants > 1 && $totalParticipants < $tour->min_participants) {
            return back()->withErrors([
                'participants' => "This tour requires a minimum of {$tour->min_participants} participants."
            ]);
        }

        // Calculate subtotal
        $subtotal = collect($validated['participants'])
            ->sum(fn($p) => $p['price'] * $p['quantity']);

        // Check if item already exists for same tour and date
        $existingItem = $cart->items()
            ->where('tour_id', $validated['tour_id'])
            ->where('tour_date', $validated['tour_date'])
            ->first();

        if ($existingItem) {
            $existingItem->update([
                'participants' => $validated['participants'],
                'subtotal' => $subtotal,
                'time_slot_id' => $validated['time_slot_id'] ?? null,
                'tour_time' => $validated['tour_time'] ?? null,
            ]);
        } else {
            $cart->items()->create([
                'tour_id' => $validated['tour_id'],
                'tour_date' => $validated['tour_date'],
                'tour_time' => $validated['tour_time'] ?? null,
                'time_slot_id' => $validated['time_slot_id'] ?? null,
                'participants' => $validated['participants'],
                'subtotal' => $subtotal,
            ]);
        }

        return back()->with('success', 'Tour added to cart');
    }

    public function update(Request $request, CartItem $item)
    {
        $validated = $request->validate([
            'participants' => 'required|array|min:1',
            'participants.*.tier_id' => 'required|exists:tour_pricing_tiers,id',
            'participants.*.name' => 'required|string',
            'participants.*.quantity' => 'required|integer|min:0',
            'participants.*.price' => 'required|numeric|min:0',
        ]);

        $subtotal = collect($validated['participants'])
            ->sum(fn($p) => $p['price'] * $p['quantity']);

        $item->update([
            'participants' => $validated['participants'],
            'subtotal' => $subtotal,
        ]);

        return back()->with('success', 'Cart updated');
    }

    public function remove(CartItem $item)
    {
        $item->delete();

        return back()->with('success', 'Item removed from cart');
    }

    public function clear()
    {
        $cart = $this->getCart();
        $cart->clear();

        return back()->with('success', 'Cart cleared');
    }

    public function count()
    {
        $cart = $this->getCart();

        return response()->json([
            'count' => $cart->item_count,
            'total' => $cart->total,
        ]);
    }

    private function getCart(): Cart
    {
        $sessionId = Session::getId();
        $userId = auth()->check() ? auth()->id() : null;

        return Cart::getOrCreate($userId, $sessionId);
    }
}
