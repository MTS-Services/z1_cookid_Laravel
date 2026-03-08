<?php

namespace App\Models;

use App\Enums\ActiveInactiveStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'image',
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
            'status' => ActiveInactiveStatus::class,
        ];
    }

    public function creater(): MorphTo
    {
        return $this->morphTo('creater');
    }

    public function updater(): MorphTo
    {
        return $this->morphTo('updater');
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }
        if (! $this->image) {
            return asset('no-user-image-icon.png');
        }

        return asset('storage/category_images/' . $this->image);
    }
}
