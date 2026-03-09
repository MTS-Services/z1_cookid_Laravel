<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderAddress;
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

        $address = OrderAddress::query()->create([
            'user_id' => $user?->id,
            'first_name' => $user?->first_name ?? 'John',
            'last_name' => $user?->last_name ?? 'Doe',
            'email' => $user?->email ?? 'john.doe@example.com',
            'phone' => $user?->phone ?? '1234567890',
            'address' => '123 Test Street',
            'state' => 'Test State',
            'city' => 'Test City',
            'zip_code' => '12345',
        ]);

        $baseAmount = 100.00;

        for ($i = 1; $i <= 7; $i++) {
            $subtotal = $baseAmount;
            $discount = 0;
            $total = $subtotal - $discount;

            Order::create([
                'order_number' => sprintf('#ORD-%06d', $i),
                'user_id' => $user?->id,
                'service_id' => $service?->id,
                'address_id' => $address->id,
                'payment_method' => 'stripe',
                'scheduled_at' => Carbon::now()->addDays($i),
                'notes' => 'Sample order #' . $i,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'status' => 'active',
                'cancelled_reason' => null,
                'cancelled_by' => null,
                'completed_at' => null,
            ]);
        }
    }
}
