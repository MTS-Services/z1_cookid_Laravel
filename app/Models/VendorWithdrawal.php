<?php

namespace App\Models;

use App\Enums\WithdrawalStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorWithdrawal extends Model
{
    protected $fillable = [
        'vendor_id',
        'amount',
        'method',
        'account_name',
        'account_number',
        'bank_name',
        'routing_number',
        'note',
        'status',
        'reviewed_by',
        'reviewed_at',
        'processed_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'status' => WithdrawalStatus::class,
            'reviewed_at' => 'datetime',
            'processed_at' => 'datetime',
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'reviewed_by');
    }
}

