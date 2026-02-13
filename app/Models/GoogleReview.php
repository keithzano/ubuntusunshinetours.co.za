<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoogleReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_name',
        'profile_photo_url',
        'rating',
        'text',
        'relative_time_description',
        'photos',
        'is_active',
    ];

    protected $casts = [
        'rating' => 'integer',
        'photos' => 'array',
        'is_active' => 'boolean',
    ];
}
