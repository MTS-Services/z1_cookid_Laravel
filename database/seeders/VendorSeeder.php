<?php

namespace Database\Seeders;

use App\Models\Vendor;
use App\Enums\ActiveInactiveStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        Vendor::create([
            'shop_name' => 'Tech Store',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'vendor@dev.com',
            'phone' => '0123456789',
            'location' => 'New York',
            'password' => Hash::make('vendor@dev.com'),
            'status' => ActiveInactiveStatus::ACTIVE,
            'email_verified_at' => now(),
        ]);

        Vendor::create([
            'shop_name' => 'Fashion Hub',
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'vendor1@dev.com',
            'phone' => '0987654321',
            'location' => 'Los Angeles',
            'password' => Hash::make('vendor1@dev.com'),
            'status' => ActiveInactiveStatus::INACTIVE,
            'email_verified_at' => now(),
        ]);
    }
}