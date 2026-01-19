<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourTimeSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'date',
        'start_time',
        'end_time',
        'available_spots',
        'booked_spots',
        'price_override',
        'is_active',
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'price_override' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function getRemainingSpots(): int
    {
        return $this->available_spots - $this->booked_spots;
    }

    public function hasAvailability(int $participants = 1): bool
    {
        return $this->is_active && $this->getRemainingSpots() >= $participants;
    }

    public function getEffectivePrice(): float
    {
        return $this->price_override ?? $this->tour->price;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
            ->where('date', '>=', now()->toDateString())
            ->whereColumn('booked_spots', '<', 'available_spots');
    }

    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }
}
