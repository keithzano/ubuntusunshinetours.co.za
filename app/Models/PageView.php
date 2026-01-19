<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageView extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'page',
        'session_id',
        'user_id',
        'ip_address',
        'user_agent',
        'referrer',
        'country',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function record(?int $tourId = null, ?string $page = null): void
    {
        self::create([
            'tour_id' => $tourId,
            'page' => $page,
            'session_id' => session()->getId(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'referrer' => request()->header('referer'),
        ]);
    }
}
