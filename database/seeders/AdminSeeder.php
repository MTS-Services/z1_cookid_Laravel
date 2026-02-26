<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Enums\ActiveInactiveStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'first_name' => 'Super',
            'last_name'  => 'Admin',
            'phone'      => '0123456789',
            'email'      => 'admin@dev.com',
            'password'   => Hash::make('admin@dev.com'),
            'status'     => ActiveInactiveStatus::ACTIVE,
            'email_verified_at' => now(),
        ]);

        Admin::create([
            'first_name' => 'Second',
            'last_name'  => 'Admin',
            'phone'      => '0987654321',
            'email'      => 'admin1@dev.com',
            'password'   => Hash::make('admin1@dev.com'),
            'status'     => ActiveInactiveStatus::ACTIVE,
            'email_verified_at' => now(),
        ]);
    }
}
