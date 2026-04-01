<?php

use App\Enums\ActiveInactiveStatus;
use App\Models\Admin;
use App\Models\PaymentGatewaySetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class)->group('admin', 'payment-gateways');

beforeEach(function () {
    $this->admin = Admin::create([
        'first_name' => 'Admin',
        'last_name' => 'User',
        'email' => 'admin@example.com',
        'phone' => '0412 345 678',
        'password' => Hash::make('password'),
        'status' => ActiveInactiveStatus::ACTIVE,
        'email_verified_at' => now(),
        'otp_verified_at' => now(),
    ]);
});

test('guest cannot view payment gateway settings', function () {
    $this->get(route('admin.fm.payment-gateways.edit'))
        ->assertRedirect();
});

test('admin can view payment gateway settings', function () {
    $this->actingAs($this->admin, 'admin')
        ->get(route('admin.fm.payment-gateways.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/finance-management/payment-gateways')
            ->has('settings')
        );
});

test('admin can save payment gateway settings', function () {
    $this->actingAs($this->admin, 'admin')
        ->put(route('admin.fm.payment-gateways.update'), [
            'stripe_publishable_key' => 'pk_test_xxx',
            'stripe_secret' => 'sk_test_yyy',
            'stripe_currency' => 'usd',
            'paypal_client_id' => 'paypal-client',
            'paypal_client_secret' => 'paypal-secret',
            'paypal_environment' => 'sandbox',
            'paypal_currency' => 'USD',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.fm.payment-gateways.edit'));

    $row = PaymentGatewaySetting::query()->first();
    expect($row)->not->toBeNull();
    expect($row->stripe_publishable_key)->toBe('pk_test_xxx');
    expect($row->stripe_secret)->toBe('sk_test_yyy');
    expect($row->paypal_client_id)->toBe('paypal-client');
    expect($row->paypal_client_secret)->toBe('paypal-secret');
});
