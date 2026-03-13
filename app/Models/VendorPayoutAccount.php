<?php

namespace App\Models;

use App\Enums\AccountTypeMethod;
use App\Enums\ActiveInactiveStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VendorPayoutAccount extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'vendor_id',
        'account_type',
        'account_holder_name',
        'account_number',
        'bank_name',
        'routing_number',
        'email',
        'card_expiry_month',
        'card_expiry_year',
        'security_code',
        'is_default',
        'status',

        'creater_id',
        'updater_id',
        'deleter_id',

        'creater_type',
        'updater_type',
        'deleter_type',

    ];

    public function casts(): array
    {
        return [
            'account_type' => AccountTypeMethod::class,
            'status' => ActiveInactiveStatus::class,
        ];
    }

    /**
     * Get the vendor that owns the payout account.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Scopes
     */
    public function accountType()
    {
        return $this->account_type->label();
    }

    public function scopeActive($query)
    {
        return $query->where('status', ActiveInactiveStatus::ACTIVE->value);
    }

    public function scopeInactive($query)
    {
        return $query->where('status', ActiveInactiveStatus::INACTIVE->value);
    }
}
