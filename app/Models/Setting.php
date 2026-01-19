<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
        'description',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function getTypedValueAttribute()
    {
        return match ($this->type) {
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $this->value,
            'json' => json_decode($this->value, true),
            default => $this->value,
        };
    }

    public static function get(string $key, $default = null)
    {
        $setting = Cache::remember("setting.{$key}", 3600, function () use ($key) {
            return self::where('key', $key)->first();
        });

        return $setting ? $setting->typed_value : $default;
    }

    public static function set(string $key, $value, string $group = 'general', string $type = 'string'): void
    {
        if ($type === 'json' && is_array($value)) {
            $value = json_encode($value);
        }

        self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'type' => $type,
            ]
        );

        Cache::forget("setting.{$key}");
    }

    public static function getGroup(string $group): array
    {
        return Cache::remember("settings.group.{$group}", 3600, function () use ($group) {
            return self::where('group', $group)
                ->get()
                ->pluck('typed_value', 'key')
                ->toArray();
        });
    }

    public static function getPublic(): array
    {
        return Cache::remember('settings.public', 3600, function () {
            return self::where('is_public', true)
                ->get()
                ->pluck('typed_value', 'key')
                ->toArray();
        });
    }

    public static function clearCache(): void
    {
        Cache::forget('settings.public');
        self::all()->each(function ($setting) {
            Cache::forget("setting.{$setting->key}");
            Cache::forget("settings.group.{$setting->group}");
        });
    }
}
