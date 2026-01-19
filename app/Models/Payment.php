<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'payment_method',
        'transaction_id',
        'payment_id',
        'amount',
        'currency',
        'status',
        'gateway_response',
        'payer_email',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_response' => 'array',
        'paid_at' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function markAsCompleted(string $transactionId = null, array $response = []): void
    {
        $this->update([
            'status' => 'completed',
            'transaction_id' => $transactionId ?? $this->transaction_id,
            'gateway_response' => $response,
            'paid_at' => now(),
        ]);
    }

    public function markAsFailed(array $response = []): void
    {
        $this->update([
            'status' => 'failed',
            'gateway_response' => $response,
        ]);
    }
}
