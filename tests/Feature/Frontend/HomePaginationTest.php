<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class)->group('frontend', 'home');

test('home page returns paginated services payload', function () {
    $this->get(route('frontend.home', ['per_page' => 4]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('frontend/index')
            ->has('services.data')
            ->has('services.links')
            ->where('services.meta.current_page', 1)
            ->where('services.meta.per_page', 6)
            ->has('categories')
        );
});
