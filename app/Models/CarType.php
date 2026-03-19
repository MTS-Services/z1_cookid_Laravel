<?php

namespace App\Models;

use App\Enums\ActiveInactiveStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CarType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'status',
        'price',

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
            'price' => 'decimal:2',
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
}
