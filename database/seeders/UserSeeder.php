<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\ActiveInactiveStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'first_name' => 'Test',
            'last_name'  => 'User',
            'phone'      => '0123456789',
            'email'      => 'user@dev.com',
            'password'   => Hash::make('user@dev.com'),
            'status'     => ActiveInactiveStatus::ACTIVE,
            'email_verified_at' => now(),
        ]);
    }
}