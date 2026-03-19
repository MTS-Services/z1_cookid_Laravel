<?php

use App\Enums\ActiveInactiveStatus;
use App\Enums\VendorStatus;
use App\Models\CarType;
use App\Models\Category;
use App\Models\Service;
use App\Models\Vendor;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class)->group('vendor', 'listing');

beforeEach(function () {
    $this->vendor = Vendor::create([
        'first_name' => 'Test',
        'last_name' => 'Vendor',
        'email' => 'vendor@listing.test',
        'password' => bcrypt('password'),
        'status' => VendorStatus::Active,
    ]);

    $this->category = Category::create([
        'name' => 'Detailing',
        'slug' => 'detailing',
        'status' => ActiveInactiveStatus::ACTIVE,
    ]);

    $this->carType = CarType::create([
        'name' => 'Sedan',
        'slug' => 'sedan',
        'status' => ActiveInactiveStatus::ACTIVE,
    ]);
});

test('listing index returns ok with empty listings for vendor', function () {
    $response = $this
        ->actingAs($this->vendor, 'vendor')
        ->get(route('vendor.lm.listing.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('vendor/listing-management/listing/index')
        ->has('listings')
        ->has('pagination')
        ->where('search', '')
    );
});

test('listing index shows vendor own services', function () {
    Service::create([
        'vendor_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'car_type_id' => $this->carType->id,
        'title' => 'Elite Wash',
        'slug' => 'elite-wash',
        'description' => 'Premium wash',
        'duration' => '2+ Hours',
        'location' => 'Downtown',
        'price' => 99.00,
    ]);

    $response = $this
        ->actingAs($this->vendor, 'vendor')
        ->get(route('vendor.lm.listing.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('vendor/listing-management/listing/index')
        ->has('listings', 1)
        ->where('listings.0.name', 'Elite Wash')
        ->where('listings.0.location', 'Downtown')
    );
});

test('listing create page returns ok with categories and car types', function () {
    $response = $this
        ->actingAs($this->vendor, 'vendor')
        ->get(route('vendor.lm.listing.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('vendor/listing-management/listing/create')
        ->has('categories')
        ->has('carTypes')
    );
});

test('vendor can store a new listing', function () {
    $response = $this
        ->actingAs($this->vendor, 'vendor')
        ->post(route('vendor.lm.listing.store'), [
            'serviceTitle' => 'New Service',
            'description' => 'Full description',
            'duration' => '2+ Hours',
            'carType' => (string) $this->carType->id,
            'category' => (string) $this->category->id,
            'location' => 'Westside',
            'features' => 'Hand wash',
            'price' => '120',
        ]);

    $response->assertRedirect(route('vendor.lm.listing.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('services', [
        'vendor_id' => $this->vendor->id,
        'title' => 'New Service',
        'location' => 'Westside',
    ]);
});

test('listing edit page returns ok for vendor own service', function () {
    $service = Service::create([
        'vendor_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'car_type_id' => $this->carType->id,
        'title' => 'Edit Me',
        'slug' => 'edit-me',
        'description' => 'Desc',
        'duration' => '2+ Hours',
        'location' => 'Here',
        'price' => 50.00,
    ]);

    $response = $this
        ->actingAs($this->vendor, 'vendor')
        ->get(route('vendor.lm.listing.edit', $service->id));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('vendor/listing-management/listing/edit')
        ->where('listing.serviceTitle', 'Edit Me')
        ->has('categories')
        ->has('carTypes')
    );
});

test('vendor cannot edit another vendor listing', function () {
    $otherVendor = Vendor::create([
        'first_name' => 'Other',
        'last_name' => 'Vendor',
        'email' => 'other@vendor.test',
        'password' => bcrypt('password'),
        'status' => VendorStatus::Active,
    ]);

    $service = Service::create([
        'vendor_id' => $otherVendor->id,
        'category_id' => $this->category->id,
        'car_type_id' => $this->carType->id,
        'title' => 'Other Service',
        'slug' => 'other-service',
        'description' => 'Desc',
        'duration' => '2+ Hours',
        'location' => 'There',
        'price' => 75.00,
    ]);

    $response = $this
        ->actingAs($this->vendor, 'vendor')
        ->get(route('vendor.lm.listing.edit', $service->id));

    $response->assertForbidden();
});

test('vendor can update own listing', function () {
    $service = Service::create([
        'vendor_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'car_type_id' => $this->carType->id,
        'title' => 'Original',
        'slug' => 'original',
        'description' => 'Desc',
        'duration' => '2+ Hours',
        'location' => 'Here',
        'price' => 50.00,
    ]);

    $response = $this
        ->actingAs($this->vendor, 'vendor')
        ->post(route('vendor.lm.listing.update', $service->id), [
            'serviceTitle' => 'Updated Title',
            'description' => 'Updated desc',
            'duration' => 'Half-Day',
            'carType' => (string) $this->carType->id,
            'category' => (string) $this->category->id,
            'location' => 'New Location',
            'features' => 'New features',
            'price' => '89',
        ]);

    $response->assertRedirect(route('vendor.lm.listing.index'));
    $response->assertSessionHas('success');

    $service->refresh();
    expect($service->title)->toBe('Updated Title');
    expect($service->location)->toBe('New Location');
});

test('vendor can destroy own listing', function () {
    $service = Service::create([
        'vendor_id' => $this->vendor->id,
        'category_id' => $this->category->id,
        'car_type_id' => $this->carType->id,
        'title' => 'To Delete',
        'slug' => 'to-delete',
        'description' => 'Desc',
        'duration' => '2+ Hours',
        'location' => 'Here',
        'price' => 50.00,
    ]);

    $response = $this
        ->actingAs($this->vendor, 'vendor')
        ->delete(route('vendor.lm.listing.destroy', $service->id));

    $response->assertRedirect(route('vendor.lm.listing.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('services', ['id' => $service->id]);
});
