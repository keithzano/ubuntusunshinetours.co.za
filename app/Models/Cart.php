<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'email',
        'abandoned_email_sent',
        'abandoned_email_sent_at',
    ];

    protected $casts = [
        'abandoned_email_sent' => 'boolean',
        'abandoned_email_sent_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function getTotalAttribute(): float
    {
        return $this->items->sum('subtotal');
    }

    public function getItemCountAttribute(): int
    {
        return $this->items->count();
    }

    public function getTotalParticipantsAttribute(): int
    {
        return $this->items->sum(function ($item) {
            return collect($item->participants)->sum('quantity');
        });
    }

    public function isEmpty(): bool
    {
        return $this->items->isEmpty();
    }

    public function clear(): void
    {
        $this->items()->delete();
    }

    public static function getOrCreate(?int $userId = null, ?string $sessionId = null): self
    {
        if ($userId) {
            $cart = self::where('user_id', $userId)->first();
            if ($cart) {
                return $cart;
            }
        }

        if ($sessionId) {
            $cart = self::where('session_id', $sessionId)->first();
            if ($cart) {
                if ($userId && !$cart->user_id && User::where('id', $userId)->exists()) {
                    $cart->update(['user_id' => $userId]);
                }
                return $cart;
            }
        }

        return self::create([
            'user_id' => $userId,
            'session_id' => $sessionId,
        ]);
    }
}
