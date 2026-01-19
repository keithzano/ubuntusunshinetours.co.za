<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\User;
use App\Models\PageView;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Overview stats
        $totalRevenue = Booking::paid()->sum('total');
        $monthlyRevenue = Booking::paid()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total');
        
        $totalBookings = Booking::count();
        $monthlyBookings = Booking::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $totalCustomers = User::where('role', 'client')->count();
        $newCustomers = User::where('role', 'client')
            ->whereMonth('created_at', now()->month)
            ->count();

        $activeTours = Tour::active()->count();

        // Recent bookings
        $recentBookings = Booking::with(['tour', 'user'])
            ->latest()
            ->take(10)
            ->get();

        // Revenue chart (last 12 months) - SQLite compatible
        $revenueChart = Booking::paid()
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(
                DB::raw("strftime('%Y', created_at) as year"),
                DB::raw("strftime('%m', created_at) as month"),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as bookings')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::create($item->year, $item->month)->format('M Y'),
                    'revenue' => $item->revenue,
                    'bookings' => $item->bookings,
                ];
            });

        // Top performing tours
        $topTours = Tour::withCount(['bookings' => fn($q) => $q->paid()])
            ->withSum(['bookings' => fn($q) => $q->paid()], 'total')
            ->orderByDesc('bookings_sum_total')
            ->take(5)
            ->get();

        // Bookings by status
        $bookingsByStatus = Booking::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        // Page views (last 30 days)
        $pageViews = PageView::where('created_at', '>=', now()->subDays(30))
            ->count();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'monthlyRevenue' => $monthlyRevenue,
                'totalBookings' => $totalBookings,
                'monthlyBookings' => $monthlyBookings,
                'totalCustomers' => $totalCustomers,
                'newCustomers' => $newCustomers,
                'activeTours' => $activeTours,
                'pageViews' => $pageViews,
            ],
            'recentBookings' => $recentBookings,
            'revenueChart' => $revenueChart,
            'topTours' => $topTours,
            'bookingsByStatus' => $bookingsByStatus,
        ]);
    }
}
