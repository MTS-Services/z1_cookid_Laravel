<?php

use App\Enums\ActiveInactiveStatus;
use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class)->group('admin', 'profile');

beforeEach(function () {
    $this->admin = Admin::create([
        'first_name' => 'Jenny',
        'last_name' => 'Wilson',
        'email' => 'admin@example.com',
        'phone' => '0412 345 678',
        'password' => Hash::make('password'),
        'status' => ActiveInactiveStatus::ACTIVE,
        'email_verified_at' => now(),
        'otp_verified_at' => now(),
    ]);
});

test('admin profile page is displayed', function () {
    $response = $this
        ->actingAs($this->admin, 'admin')
        ->get(route('admin.profile.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/profile/index')
        ->has('admin')
        ->where('admin.first_name', 'Jenny')
        ->where('admin.last_name', 'Wilson')
        ->where('admin.email', 'admin@example.com')
        ->where('admin.phone', '0412 345 678')
    );
});

test('admin profile information can be updated', function () {
    $response = $this
        ->actingAs($this->admin, 'admin')
        ->patch(route('admin.profile.update'), [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'email' => 'updated@example.com',
            'phone' => '0999 111 222',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.profile.index'))
        ->assertSessionHas('success');

    $this->admin->refresh();

    expect($this->admin->first_name)->toBe('Updated');
    expect($this->admin->last_name)->toBe('Name');
    expect($this->admin->email)->toBe('updated@example.com');
    expect($this->admin->phone)->toBe('0999 111 222');
});

test('admin profile can be updated with new password', function () {
    $response = $this
        ->actingAs($this->admin, 'admin')
        ->patch(route('admin.profile.update'), [
            'first_name' => $this->admin->first_name,
            'last_name' => $this->admin->last_name,
            'email' => $this->admin->email,
            'phone' => $this->admin->phone,
            'current_password' => 'password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.profile.index'));

    $this->admin->refresh();
    expect(Hash::check('new-secure-password', $this->admin->password))->toBeTrue();
});

test('admin profile update requires current password when changing password', function () {
    $response = $this
        ->actingAs($this->admin, 'admin')
        ->patch(route('admin.profile.update'), [
            'first_name' => $this->admin->first_name,
            'last_name' => $this->admin->last_name,
            'email' => $this->admin->email,
            'phone' => $this->admin->phone,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response->assertSessionHasErrors('current_password');
});

test('guest cannot access admin profile page', function () {
    $response = $this->get(route('admin.profile.index'));

    $response->assertRedirect(route('admin.login'));
});
