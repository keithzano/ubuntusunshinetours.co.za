<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PayFastController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DiscountController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TourController as AdminTourController;
use App\Http\Controllers\PublicSettingsController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Tours
Route::get('/tours', [TourController::class, 'index'])->name('tours.index');
Route::get('/tours/{slug}', [TourController::class, 'show'])->name('tours.show');
Route::get('/tours/{tour}/availability', [TourController::class, 'getAvailability'])->name('tours.availability');
Route::get('/tours/{tour}/reviews', [ReviewController::class, 'tourReviews'])->name('tours.reviews');

// Cart
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/{item}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{item}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

// Checkout
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout/discount', [CheckoutController::class, 'applyDiscount'])->name('checkout.discount');
Route::delete('/checkout/discount', [CheckoutController::class, 'removeDiscount'])->name('checkout.discount.remove');
Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('checkout.process');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

// PayFast
Route::post('/payfast/notify', [PayFastController::class, 'notify'])->name('payfast.notify');

// Search Autocomplete
Route::get('/search/autocomplete', [SearchController::class, 'autocomplete'])->name('search.autocomplete');

// Booking Lookup (for guests)
Route::get('/booking/lookup', [BookingController::class, 'lookup'])->name('booking.lookup');
Route::post('/booking/find', [BookingController::class, 'find'])->name('booking.find');
Route::get('/booking/invoice/{booking}', [BookingController::class, 'publicInvoice'])->name('booking.invoice');

// Authenticated Client Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Client Dashboard redirect
    Route::get('/dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('client.bookings.index');
    })->name('dashboard');

    // Client Bookings
    Route::prefix('my')->name('client.')->group(function () {
        Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
        Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
        Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
        Route::get('/bookings/{booking}/invoice', [BookingController::class, 'invoice'])->name('bookings.invoice');

        // Reviews
        Route::get('/bookings/{booking}/review', [ReviewController::class, 'create'])->name('reviews.create');
        Route::post('/bookings/{booking}/review', [ReviewController::class, 'store'])->name('reviews.store');

        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/{tour}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
        Route::get('/wishlist/{tour}/status', [WishlistController::class, 'status'])->name('wishlist.status');
    });
});

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Tours
    Route::get('/tours', [AdminTourController::class, 'index'])->name('tours.index');
    Route::get('/tours/create', [AdminTourController::class, 'create'])->name('tours.create');
    Route::post('/tours', [AdminTourController::class, 'store'])->name('tours.store');
    Route::get('/tours/{tour}/edit', [AdminTourController::class, 'edit'])->name('tours.edit');
    Route::put('/tours/{tour}', [AdminTourController::class, 'update'])->name('tours.update');
    Route::delete('/tours/{tour}', [AdminTourController::class, 'destroy'])->name('tours.destroy');
    Route::post('/tours/{tour}/toggle-status', [AdminTourController::class, 'toggleStatus'])->name('tours.toggle-status');
    Route::post('/tours/{tour}/toggle-featured', [AdminTourController::class, 'toggleFeatured'])->name('tours.toggle-featured');
    Route::get('/tours/{tour}/time-slots', [AdminTourController::class, 'timeSlots'])->name('tours.time-slots');
    Route::post('/tours/{tour}/time-slots', [AdminTourController::class, 'storeTimeSlots'])->name('tours.time-slots.store');
    Route::delete('/time-slots/{timeSlot}', [AdminTourController::class, 'deleteTimeSlot'])->name('time-slots.destroy');

    // Categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::post('/categories/{category}/toggle-status', [CategoryController::class, 'toggleStatus'])->name('categories.toggle-status');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Locations
    Route::get('/locations', [LocationController::class, 'index'])->name('locations.index');
    Route::get('/locations/create', [LocationController::class, 'create'])->name('locations.create');
    Route::post('/locations', [LocationController::class, 'store'])->name('locations.store');
    Route::get('/locations/{location}/edit', [LocationController::class, 'edit'])->name('locations.edit');
    Route::put('/locations/{location}', [LocationController::class, 'update'])->name('locations.update');
    Route::delete('/locations/{location}', [LocationController::class, 'destroy'])->name('locations.destroy');

    // Bookings
    Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{booking}', [AdminBookingController::class, 'show'])->name('bookings.show');
    Route::get('/bookings/{booking}/invoice', [AdminBookingController::class, 'invoice'])->name('bookings.invoice');
    Route::patch('/bookings/{booking}/status', [AdminBookingController::class, 'updateStatus'])->name('bookings.status');
    Route::patch('/bookings/{booking}/payment-status', [AdminBookingController::class, 'updatePaymentStatus'])->name('bookings.payment-status');

    // Customers
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');

    // Reviews
    Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::get('/reviews/{review}', [ReviewController::class, 'show'])->name('reviews.show');
    Route::post('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
    Route::post('/reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Discounts
    Route::get('/discounts', [DiscountController::class, 'index'])->name('discounts.index');
    Route::get('/discounts/create', [DiscountController::class, 'create'])->name('discounts.create');
    Route::post('/discounts', [DiscountController::class, 'store'])->name('discounts.store');
    Route::get('/discounts/{discount}', [DiscountController::class, 'show'])->name('discounts.show');
    Route::get('/discounts/{discount}/edit', [DiscountController::class, 'edit'])->name('discounts.edit');
    Route::put('/discounts/{discount}', [DiscountController::class, 'update'])->name('discounts.update');
    Route::delete('/discounts/{discount}', [DiscountController::class, 'destroy'])->name('discounts.destroy');
    Route::post('/discounts/{discount}/toggle', [DiscountController::class, 'toggleStatus'])->name('discounts.toggle');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/general', [SettingsController::class, 'updateGeneral'])->name('settings.general');
    Route::post('/settings/payfast', [SettingsController::class, 'updatePayfast'])->name('settings.payfast');
    Route::post('/settings/email', [SettingsController::class, 'updateEmail'])->name('settings.email');
    Route::post('/settings/seo', [SettingsController::class, 'updateSeo'])->name('settings.seo');
});

// API Routes
Route::prefix('api')->group(function () {
    Route::get('/google-reviews', [App\Http\Controllers\Api\GoogleReviewsController::class, 'index']);
    Route::get('/google-reviews/summary', [App\Http\Controllers\Api\GoogleReviewsController::class, 'summary']);
    Route::get('/settings', [PublicSettingsController::class, 'index']);
});

require __DIR__.'/settings.php';

// Temporary debug route - remove after checking
Route::get('/debug-booking/{id}', function ($id) {
    if (!auth()->check()) {
        return 'Not authenticated';
    }
    
    $user = auth()->user();
    $booking = \App\Models\Booking::find($id);
    
    if (!$booking) {
        return 'Booking not found';
    }
    
    return [
        'user_id' => $user->id,
        'user_id_type' => gettype($user->id),
        'user_email' => $user->email,
        'user_role' => $user->role,
        'booking_id' => $booking->id,
        'booking_user_id' => $booking->user_id,
        'booking_user_id_type' => gettype($booking->user_id),
        'booking_customer_email' => $booking->customer_email,
        'can_view' => $user->id === $booking->user_id,
        'can_view_strict' => $user->id == $booking->user_id,
        'is_admin' => $user->isAdmin(),
    ];
});
