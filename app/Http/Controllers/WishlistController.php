<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $wishlist = $user->wishlist()
            ->with(['category', 'location'])
            ->get();

        return Inertia::render('client/wishlist', [
            'wishlist' => $wishlist,
        ]);
    }

    public function toggle(Tour $tour)
    {
        $user = auth()->user();

        if ($user->wishlist()->where('tour_id', $tour->id)->exists()) {
            $user->wishlist()->detach($tour->id);
            $message = 'Removed from wishlist';
            $added = false;
        } else {
            $user->wishlist()->attach($tour->id);
            $message = 'Added to wishlist';
            $added = true;
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'added' => $added,
        ]);
    }

    public function status(Tour $tour)
    {
        $user = auth()->user();
        $inWishlist = $user 
            ? $user->wishlist()->where('tour_id', $tour->id)->exists() 
            : false;

        return response()->json([
            'in_wishlist' => $inWishlist,
        ]);
    }
}
