<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'transaction_id',
        'amount',
        'method',
        'status',
        'stripe_payment_intent_id',
        'stripe_charge_id',
        'stripe_customer_id',
        'paypal_order_id',
        'paypal_capture_id',
        'paypal_payer_id',
        'gateway_response',
        'paid_at',
        'refunded_at',
        'refund_amount',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'refund_amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'refunded_at' => 'datetime',
            'status' => PaymentStatus::class,
            'method' => PaymentMethod::class,
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isStripe(): bool
    {
        return $this->method === PaymentMethod::Stripe;
    }

    public function isPayPal(): bool
    {
        return $this->method === PaymentMethod::Paypal;
    }

    public function isPaid(): bool
    {
        return $this->status === PaymentStatus::Paid;
    }
}
