<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    /**
     * Generate a unique order number (e.g. ORD-20260310-A1B2C3).
     */
    public static function generateOrderNumber(): string
    {
        $prefix = 'ORD-' . now()->format('Ymd');
        $suffix = strtoupper(Str::random(6));

        do {
            $candidate = "{$prefix}-{$suffix}";
        } while (static::where('order_number', $candidate)->exists());

        return $candidate;
    }

    protected $fillable = [
        'user_id',
        'service_id',
        'address_id',
        'order_number',
        'payment_method',
        'scheduled_at',
        'notes',
        'subtotal',
        'discount',
        'total',
        'status',
        'cancelled_reason',
        'cancelled_by',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
            'status' => OrderStatus::class,
            'payment_method' => PaymentMethod::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(OrderAddress::class, 'address_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
