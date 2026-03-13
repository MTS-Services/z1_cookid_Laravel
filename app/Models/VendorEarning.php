<?php

namespace App\Models;

use App\Enums\CommissionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorEarning extends Model
{
    protected $fillable = [
        'vendor_id',
        'order_id',
        'gross_amount',
        'commission',
        'commission_type',
        'net_amount',
        'released_at',
    ];

    protected function casts(): array
    {
        return [
            'gross_amount' => 'decimal:2',
            'commission' => 'decimal:2',
            'net_amount' => 'decimal:2',
            'released_at' => 'datetime',
            'commission_type' => CommissionType::class,
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}

