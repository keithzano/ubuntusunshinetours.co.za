<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'tour_id',
        'time_slot_id',
        'tour_date',
        'tour_time',
        'participants',
        'subtotal',
    ];

    protected $casts = [
        'tour_date' => 'date',
        'tour_time' => 'datetime:H:i',
        'participants' => 'array',
        'subtotal' => 'decimal:2',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function timeSlot(): BelongsTo
    {
        return $this->belongsTo(TourTimeSlot::class, 'time_slot_id');
    }

    public function getTotalParticipantsAttribute(): int
    {
        return collect($this->participants)->sum('quantity');
    }

    public function calculateSubtotal(): float
    {
        return collect($this->participants)->sum(function ($participant) {
            return $participant['price'] * $participant['quantity'];
        });
    }

    public function updateSubtotal(): void
    {
        $this->subtotal = $this->calculateSubtotal();
        $this->save();
    }
}
