<?php

namespace App\Models;

use App\Enums\ActiveInactiveStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'vendor_id',
        'category_id',
        'title',
        'slug',
        'description',
        'car_type_id',
        'duration',
        'price',
        'image',
        'average_rating',
        'total_reviews',
        'status',

        'creater_id',
        'creater_type',
        'updater_id',
        'updater_type',
        'deleter_id',
        'deleter_type',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'average_rating' => 'decimal:2',
            'total_reviews' => 'integer',
            'status' => ActiveInactiveStatus::class,
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function carType(): BelongsTo
    {
        return $this->belongsTo(CarType::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ServiceImage::class);
    }

    public function inclusions(): HasMany
    {
        return $this->hasMany(ServiceInclusion::class);
    }
}
