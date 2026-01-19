<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourPricingTier extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'name',
        'description',
        'price',
        'min_age',
        'max_age',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'R ' . number_format($this->price, 2);
    }
}
