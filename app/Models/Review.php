<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'booking_id',
        'user_id',
        'reviewer_name',
        'reviewer_email',
        'rating',
        'title',
        'comment',
        'photos',
        'is_verified',
        'is_approved',
        'approved_at',
    ];

    protected $casts = [
        'photos' => 'array',
        'is_verified' => 'boolean',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approve(): void
    {
        $this->update([
            'is_approved' => true,
            'approved_at' => now(),
        ]);
        
        $this->tour->updateRating();
    }

    public function reject(): void
    {
        $this->update(['is_approved' => false]);
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }
}
