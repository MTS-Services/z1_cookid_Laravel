<?php

use App\Enums\ActiveInactiveStatus;
use App\Models\Admin;
use App\Models\Service;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

it('shows all services tab by default', function () {
    $admin = Admin::factory()->create();

    Service::factory()->count(2)->create(['status' => ActiveInactiveStatus::ACTIVE]);
    Service::factory()->count(2)->create(['status' => ActiveInactiveStatus::INACTIVE]);

    actingAs($admin, 'admin');

    $response = get(route('admin.sm.services.index'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/service-management/services/index')
            ->where('tab', 'all')
        );
});

it('can activate and deactivate a service', function () {
    $admin = Admin::factory()->create();
    $service = Service::factory()->create(['status' => ActiveInactiveStatus::INACTIVE]);

    actingAs($admin, 'admin');

    post(route('admin.sm.services.approve', $service));
    expect($service->refresh()->status)->toBe(ActiveInactiveStatus::ACTIVE);

    post(route('admin.sm.services.cancel', $service));
    expect($service->refresh()->status)->toBe(ActiveInactiveStatus::INACTIVE);
});
