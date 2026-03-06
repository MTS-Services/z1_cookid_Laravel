<?php

namespace Database\Seeders;

use App\Enums\VendorStatus;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        Vendor::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'vendor@dev.com',
            'phone' => '0123456789',
            'shop_name' => 'Tech Store',

            // Updated Location Fields
            'region_state' => 'New York',
            'city' => 'New York City',
            'zip_code' => '10001',
            'address' => '5th Avenue, Manhattan',

            // Placeholder for ID
            'government_issue_license' => 'https://placehold.net/600x400.png',

            'password' => Hash::make('vendor@dev.com'), // Use a secure default for testing
            'status' => VendorStatus::Active,
            'email_verified_at' => now(),
            'otp_verified_at' => now(),
        ]);

        Vendor::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'vendor1@dev.com',
            'phone' => '0987654321',
            'shop_name' => 'Fashion Hub',

            // Updated Location Fields
            'region_state' => 'California',
            'city' => 'Los Angeles',
            'zip_code' => '90001',
            'address' => 'Melrose Avenue',

            'government_issue_license' => 'https://placehold.net/600x400.png',

            'password' => Hash::make('vendor1@dev.com'),
            'status' => VendorStatus::Pending,
            'email_verified_at' => now(),
            'otp_verified_at' => now(),
        ]);
    }
}
