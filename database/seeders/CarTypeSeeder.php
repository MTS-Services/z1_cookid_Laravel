<?php

namespace Database\Seeders;

use App\Enums\ActiveInactiveStatus;
use App\Models\CarType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CarTypeSeeder extends Seeder
{
    public function run(): void
    {
        $carTypes = [
            ['name' => 'Compact', 'price' => 45.00],
            ['name' => 'Sedan', 'price' => 55.00],
            ['name' => 'SUV', 'price' => 75.00],
            ['name' => 'Truck', 'price' => 85.00],
            ['name' => 'Luxury', 'price' => 120.00],
            ['name' => 'Electric', 'price' => 65.00],
        ];

        foreach ($carTypes as $type) {
            CarType::create([
                'name' => $type['name'],
                'slug' => Str::slug($type['name']),
                'status' => ActiveInactiveStatus::ACTIVE,
                'price' => $type['price'],
            ]);
        }
    }
}
