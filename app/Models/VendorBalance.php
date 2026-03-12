<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorBalance extends Model
{
    protected $fillable = [
        'vendor_id',
        'total_earned',
        'total_withdrawn',
        'pending_balance',
        'available_balance',
    ];

    protected function casts(): array
    {
        return [
            'total_earned' => 'decimal:2',
            'total_withdrawn' => 'decimal:2',
            'pending_balance' => 'decimal:2',
            'available_balance' => 'decimal:2',
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }
}

