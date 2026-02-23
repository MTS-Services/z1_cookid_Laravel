<?php

namespace Database\Seeders;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::insert(
            [
                [
                    'username' => 'user',
                    'name' => 'User',
                    'user_type' => UserType::BOTH,
                    'email' => 'user@dev.com',
                    'password' => Hash::make('user@dev.com'),
                    'is_verified' => true,
                ],
                [
                    'username' => 'manager',
                    'name' => 'Manager',
                    'user_type' => UserType::PROPERTY_OWNER,
                    'email' => 'manager@dev.com',
                    'password' => Hash::make('manager@dev.com'),
                    'is_verified' => true,
                ],
                [
                    'username' => 'realtor',
                    'name' => 'Realtor',
                    'user_type' => UserType::REALTOR,
                    'email' => 'realtor@dev.com',
                    'password' => Hash::make('realtor@dev.com'),
                    'is_verified' => true,
                ],
                [
                    'username' => 'realtor&Rentals',
                    'name' => 'Realtor & Rentals',
                    'user_type' => UserType::BOTH,
                    'email' => 'realtor&rentals@dev.com',
                    'password' => Hash::make('realtor&rentals@dev.com'),
                    'is_verified' => true,
                ],
            ]
        );
    }
}
