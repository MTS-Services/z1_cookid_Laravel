<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Data based on your UI image
        $orderData = [
            'order_number' => '#6548-225568',
            'service_name' => 'Elite Auto Spa',
            'vendor_name' => 'Maktech Store',
            'price' => 100.00,
            'commission' => 7.00,
            'vendor_earning' => 93.00,
            'status' => 'active',
        ];

        // Creating 7 identical records to match your "Showing 1 to 7 results" footer
        for ($i = 0; $i < 7; $i++) {
            // Note: If you made order_number 'unique' in the migration,
            // you might want to append the index to avoid errors:
            $currentOrder = $orderData;
            $currentOrder['order_number'] = '#6548-22556'.$i;

            Order::create($currentOrder);
        }
    }
}
