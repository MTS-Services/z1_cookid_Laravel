<?php

use App\Enums\VendorStatus;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class)->group('vendor', 'dashboard');

beforeEach(function () {
    $this->vendor = Vendor::create([
        'first_name' => 'Test',
        'last_name' => 'Vendor',
        'email' => 'vendor@dashboard.test',
        'password' => bcrypt('password'),
        'status' => VendorStatus::Active,
    ]);
});

test('vendor dashboard returns ok with stats and chart data', function () {
    $response = $this
        ->actingAs($this->vendor, 'vendor')
        ->get(route('vendor.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('vendor/dashboard')
        ->has('stats')
        ->has('chartData')
        ->has('recentOrders')
        ->has('recentOrdersTotal')
        ->where('stats.0.label', 'Active Listings')
        ->where('recentOrdersTotal', 0)
    );
});

test('guest cannot access vendor dashboard', function () {
    $this->get(route('vendor.dashboard'))->assertRedirect();
});
