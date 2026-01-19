<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_reference',
        'user_id',
        'tour_id',
        'time_slot_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_country',
        'tour_date',
        'tour_time',
        'participants',
        'total_participants',
        'special_requirements',
        'subtotal',
        'discount',
        'discount_code',
        'tax',
        'total',
        'currency',
        'status',
        'payment_status',
        'confirmed_at',
        'cancelled_at',
        'cancellation_reason',
        'invoice_number',
        'invoice_generated_at',
    ];

    protected $casts = [
        'tour_date' => 'date',
        'tour_time' => 'datetime:H:i',
        'participants' => 'array',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'invoice_generated_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->booking_reference)) {
                $booking->booking_reference = self::generateBookingReference();
            }
        });
    }

    public static function generateBookingReference(): string
    {
        do {
            $reference = 'UST-' . strtoupper(Str::random(8));
        } while (self::where('booking_reference', $reference)->exists());

        return $reference;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function timeSlot(): BelongsTo
    {
        return $this->belongsTo(TourTimeSlot::class, 'time_slot_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function latestPayment(): HasOne
    {
        return $this->hasOne(Payment::class)->latest();
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function confirm(): void
    {
        $this->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);
    }

    public function cancel(string $reason = null): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }

    public function markAsPaid(): void
    {
        $this->update(['payment_status' => 'paid']);
    }

    public function generateInvoiceNumber(): string
    {
        if (!$this->invoice_number) {
            $this->invoice_number = 'INV-' . date('Y') . '-' . str_pad($this->id, 6, '0', STR_PAD_LEFT);
            $this->invoice_generated_at = now();
            $this->save();
        }

        return $this->invoice_number;
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('tour_date', '>=', now()->toDateString())
            ->whereIn('status', ['pending', 'confirmed']);
    }

    public function scopePast($query)
    {
        return $query->where('tour_date', '<', now()->toDateString());
    }
}
