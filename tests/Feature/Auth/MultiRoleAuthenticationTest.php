<?php

use App\Enums\ActiveInactiveStatus;
use App\Enums\VendorStatus;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('customer can open vendor login while already logged in', function () {
    $customer = User::create([
        'first_name' => 'Customer',
        'last_name' => 'User',
        'email' => 'customer@example.com',
        'password' => bcrypt('password'),
        'status' => ActiveInactiveStatus::ACTIVE,
    ]);

    $response = $this
        ->actingAs($customer, 'web')
        ->get(route('vendor.auth.login'));

    $response->assertOk();
});

test('vendor can open customer login while already logged in', function () {
    $vendor = Vendor::create([
        'first_name' => 'Provider',
        'last_name' => 'Vendor',
        'email' => 'provider@example.com',
        'password' => bcrypt('password'),
        'status' => VendorStatus::Active,
    ]);

    $response = $this
        ->actingAs($vendor, 'vendor')
        ->get(route('user.auth.login'));

    $response->assertOk();
});
