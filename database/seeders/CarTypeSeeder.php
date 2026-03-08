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
            'Compact',
            'Sedan',
            'SUV',
            'Truck',
            'Luxury',
            'Electric',
        ];

        foreach ($carTypes as $type) {
            CarType::create([
                'name' => $type,
                'slug' => Str::slug($type),
                'status' => ActiveInactiveStatus::ACTIVE,
            ]);
        }
    }
}
