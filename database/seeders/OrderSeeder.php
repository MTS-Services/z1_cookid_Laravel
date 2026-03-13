<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::query()->first();
        $service = Service::query()->first();
        $baseAmount = 100.00;

        for ($i = 1; $i <= 7; $i++) {
            $subtotal = $baseAmount;
            $discount = 0;
            $total = $subtotal - $discount;

            Order::create([
                'order_number' => sprintf('#ORD-%06d', $i),
                'user_id' => $user?->id,
                'service_id' => $service?->id,
                'payment_method' => 'stripe',
                'scheduled_at' => Carbon::now()->addDays($i),
                'notes' => 'Sample order #'.$i,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'status' => OrderStatus::Confirmed->value,
                'cancelled_reason' => null,
                'cancelled_by' => null,
                'completed_at' => null,
            ]);
        }
    }
}
