<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Admin::insert([
            [
                'username' => 'admin',
                'name' => 'admin',
                'email' => 'admin@dev.com',
                'password' => Hash::make('admin@dev.com'),
                'email_verified_at' => now(),
            ],
            [
                'username' => 'admin1',
                'name' => 'admin',
                'email' => 'admin1@dev.com',
                'password' => Hash::make('admin1@dev.com'),
                'email_verified_at' => now(),
            ],
        ]);
    }
}
