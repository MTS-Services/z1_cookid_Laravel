<?php

use App\Enums\VendorStatus;
use App\Enums\WithdrawalStatus;
use App\Models\Admin;
use App\Models\Vendor;
use App\Models\VendorWithdrawal;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

uses()->group('admin', 'finance');

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

it('shows finance dashboard with stats when authenticated as admin', function () {
    actingAs($this->admin, 'admin');

    $response = get(route('admin.fm.index'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/finance-management/finance')
            ->has('stats')
            ->where('stats.totalAvailableBalance', 0)
            ->where('stats.pendingWithdrawalCount', 0)
        );
});

it('shows withdrawals index when authenticated as admin', function () {
    actingAs($this->admin, 'admin');

    $response = get(route('admin.fm.withdrawals.index', ['tab' => 'pending']));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/finance-management/withdrawals/index')
            ->has('withdrawals')
            ->where('tab', 'pending')
        );
});

it('shows withdrawal detail when authenticated as admin', function () {
    $vendor = Vendor::query()->first();
    if (! $vendor) {
        $vendor = Vendor::create([
            'first_name' => 'Test',
            'last_name' => 'Vendor',
            'email' => 'vendor-withdrawal-test@example.com',
            'shop_name' => 'Test Shop',
            'password' => bcrypt('password'),
            'status' => VendorStatus::Active,
        ]);
    }

    $withdrawal = VendorWithdrawal::create([
        'vendor_id' => $vendor->id,
        'amount' => 100.00,
        'status' => WithdrawalStatus::Pending,
    ]);

    actingAs($this->admin, 'admin');

    $response = get(route('admin.fm.withdrawals.show', $withdrawal));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/finance-management/withdrawals/show')
            ->has('withdrawal')
            ->where('withdrawal.id', $withdrawal->id)
            ->where('withdrawal.status', 'pending')
        );
});

it('approves pending withdrawal when authenticated as admin', function () {
    $vendor = Vendor::query()->first();
    if (! $vendor) {
        $vendor = Vendor::create([
            'first_name' => 'Test',
            'last_name' => 'Vendor',
            'email' => 'vendor-approve-test@example.com',
            'shop_name' => 'Test Shop',
            'password' => bcrypt('password'),
            'status' => VendorStatus::Active,
        ]);
    }

    $withdrawal = VendorWithdrawal::create([
        'vendor_id' => $vendor->id,
        'amount' => 50.00,
        'status' => WithdrawalStatus::Pending,
    ]);

    actingAs($this->admin, 'admin');

    $response = post(route('admin.fm.withdrawals.approve', $withdrawal));

    $response->assertRedirect();
    expect($withdrawal->refresh()->status)->toBe(WithdrawalStatus::Approved);
});

it('rejects pending withdrawal with optional reason when authenticated as admin', function () {
    $vendor = Vendor::query()->first();
    if (! $vendor) {
        $vendor = Vendor::create([
            'first_name' => 'Test',
            'last_name' => 'Vendor',
            'email' => 'vendor-reject-test@example.com',
            'shop_name' => 'Test Shop',
            'password' => bcrypt('password'),
            'status' => VendorStatus::Active,
        ]);
    }

    $withdrawal = VendorWithdrawal::create([
        'vendor_id' => $vendor->id,
        'amount' => 75.00,
        'status' => WithdrawalStatus::Pending,
    ]);

    actingAs($this->admin, 'admin');

    $response = post(route('admin.fm.withdrawals.reject', $withdrawal), [
        'rejection_reason' => 'Invalid payout account.',
    ]);

    $response->assertRedirect();
    $withdrawal->refresh();
    expect($withdrawal->status)->toBe(WithdrawalStatus::Rejected);
    expect($withdrawal->rejection_reason)->toBe('Invalid payout account.');
});
