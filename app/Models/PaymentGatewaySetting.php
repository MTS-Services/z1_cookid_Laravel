<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentGatewaySetting extends Model
{
    protected $fillable = [
        'stripe_publishable_key',
        'stripe_secret',
        'stripe_currency',
        'paypal_client_id',
        'paypal_client_secret',
        'paypal_environment',
        'paypal_currency',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stripe_secret' => 'encrypted',
            'paypal_client_secret' => 'encrypted',
        ];
    }
}
