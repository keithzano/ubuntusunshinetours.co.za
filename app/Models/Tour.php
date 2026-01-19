<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tour extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'category_id',
        'location_id',
        'price',
        'original_price',
        'price_type',
        'max_group_size',
        'duration',
        'duration_minutes',
        'highlights',
        'includes',
        'excludes',
        'what_to_bring',
        'meeting_point',
        'cancellation_policy',
        'languages',
        'accessibility',
        'available_days',
        'start_time',
        'end_time',
        'available_from',
        'available_until',
        'min_participants',
        'max_participants',
        'booking_cutoff_hours',
        'featured_image',
        'gallery',
        'video_url',
        'meta_title',
        'meta_description',
        'rating',
        'reviews_count',
        'bookings_count',
        'views_count',
        'is_active',
        'is_featured',
        'is_bestseller',
        'instant_confirmation',
        'free_cancellation',
        'free_cancellation_hours',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'highlights' => 'array',
        'includes' => 'array',
        'excludes' => 'array',
        'what_to_bring' => 'array',
        'meeting_point' => 'array',
        'languages' => 'array',
        'accessibility' => 'array',
        'available_days' => 'array',
        'gallery' => 'array',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'available_from' => 'date',
        'available_until' => 'date',
        'rating' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_bestseller' => 'boolean',
        'instant_confirmation' => 'boolean',
        'free_cancellation' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function pricingTiers(): HasMany
    {
        return $this->hasMany(TourPricingTier::class)->orderBy('sort_order');
    }

    public function timeSlots(): HasMany
    {
        return $this->hasMany(TourTimeSlot::class);
    }

    public function availableTimeSlots(): HasMany
    {
        return $this->hasMany(TourTimeSlot::class)
            ->where('is_active', true)
            ->where('date', '>=', now()->toDateString())
            ->whereColumn('booked_spots', '<', 'available_spots');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    public function wishlistedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wishlists')->withTimestamps();
    }

    public function pageViews(): HasMany
    {
        return $this->hasMany(PageView::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeBestseller($query)
    {
        return $query->where('is_bestseller', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('short_description', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    public function getDiscountPercentageAttribute(): ?int
    {
        if ($this->original_price && $this->original_price > $this->price) {
            return round((($this->original_price - $this->price) / $this->original_price) * 100);
        }
        return null;
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'R ' . number_format($this->price, 2);
    }

    public function updateRating(): void
    {
        $reviews = $this->approvedReviews();
        $this->rating = $reviews->avg('rating') ?? 0;
        $this->reviews_count = $reviews->count();
        $this->save();
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }
}
