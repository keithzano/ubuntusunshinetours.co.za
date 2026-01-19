<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::where('role', 'client')
            ->withCount('bookings')
            ->withSum(['bookings' => fn($q) => $q->paid()], 'total');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $customers = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(User $customer): Response
    {
        $customer->load(['bookings.tour', 'reviews.tour']);

        return Inertia::render('admin/customers/show', [
            'customer' => $customer,
        ]);
    }
}
