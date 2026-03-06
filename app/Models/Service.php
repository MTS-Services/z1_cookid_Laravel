<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    /** @use HasFactory<\Database\Factories\ServiceFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vendor_id',
        'service_name',
        'area',
        'city',
        'price',
        'status',
        'short_description',
        'description',
        'hero_image',
        'gallery_images',
    ];

    public function casts(): array
    {
        return [
            'gallery_images' => 'array',
            'hero_image' => 'string',
            'price' => 'float',
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }
}
