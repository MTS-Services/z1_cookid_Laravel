<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'service_name',
        'vendor_name',
        'price',
        'commission',
        'vendor_earning',
        'status',
    ];

    /**
     * Optional: Automatically calculate vendor earning before saving
     * if you want the backend to handle the math.
     */
    protected static function booted()
    {
        static::creating(function ($order) {
            if (empty($order->vendor_earning)) {
                $order->vendor_earning = $order->price - $order->commission;
            }
        });
    }
}
