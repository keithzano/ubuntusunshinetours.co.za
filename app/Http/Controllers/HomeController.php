<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Location;
use App\Models\Tour;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredTours = Tour::with(['category', 'location'])
            ->active()
            ->featured()
            ->take(8)
            ->get();

        $bestsellerTours = Tour::with(['category', 'location'])
            ->active()
            ->bestseller()
            ->take(8)
            ->get();

        $categories = Category::active()
            ->withCount('activeTours')
            ->ordered()
            ->get();

        $locations = Location::active()
            ->featured()
            ->withCount('activeTours')
            ->get();

        $recentTours = Tour::with(['category', 'location'])
            ->active()
            ->latest()
            ->take(8)
            ->get();

        return Inertia::render('home', [
            'featuredTours' => $featuredTours,
            'bestsellerTours' => $bestsellerTours,
            'categories' => $categories,
            'locations' => $locations,
            'recentTours' => $recentTours,
        ]);
    }
}
