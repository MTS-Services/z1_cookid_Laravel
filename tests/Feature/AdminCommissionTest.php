<?php

use App\Enums\ActiveInactiveStatus;
use App\Enums\CommissionType;
use App\Models\Admin;
use App\Models\Category;
use App\Models\Commission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

uses(RefreshDatabase::class)->group('admin', 'commission');

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

it('shows commission page with commissions and options when authenticated as admin', function () {
    Commission::factory()->count(2)->create();

    actingAs($this->admin, 'admin');

    $response = get(route('admin.commission'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/commission')
            ->has('commissions', 2)
            ->has('categories')
            ->has('commissionTypes')
            ->has('statuses')
        );
});

it('forbids guest from commission page', function () {
    get(route('admin.commission'))->assertRedirect();
});

it('can store a new commission', function () {
    actingAs($this->admin, 'admin');

    $response = post(route('admin.commission.store'), [
        'category_id' => null,
        'commission_type' => CommissionType::Percentage->value,
        'commission_value' => 7.5,
        'status' => ActiveInactiveStatus::ACTIVE->value,
    ]);

    $response->assertRedirect(route('admin.commission'));
    expect(Commission::query()->count())->toBe(1);
    $commission = Commission::query()->first();
    expect((float) $commission->commission_value)->toBe(7.5);
    expect($commission->commission_type)->toBe(CommissionType::Percentage);
    expect($commission->created_by)->toBe($this->admin->id);
});

it('can update a commission', function () {
    $commission = Commission::factory()->create([
        'commission_value' => 5,
        'created_by' => $this->admin->id,
        'updated_by' => $this->admin->id,
    ]);

    actingAs($this->admin, 'admin');

    $response = put(route('admin.commission.update', $commission), [
        'category_id' => null,
        'commission_type' => CommissionType::Fixed->value,
        'commission_value' => 10.00,
        'status' => ActiveInactiveStatus::INACTIVE->value,
    ]);

    $response->assertRedirect(route('admin.commission'));
    $commission->refresh();
    expect((float) $commission->commission_value)->toBe(10.0);
    expect($commission->commission_type)->toBe(CommissionType::Fixed);
    expect($commission->status)->toBe(ActiveInactiveStatus::INACTIVE);
    expect($commission->updated_by)->toBe($this->admin->id);
});

it('can destroy a commission', function () {
    $commission = Commission::factory()->create();

    actingAs($this->admin, 'admin');

    $response = delete(route('admin.commission.destroy', $commission));

    $response->assertRedirect(route('admin.commission'));
    expect(Commission::query()->find($commission->id))->toBeNull();
});

it('resolves category-specific commission over global', function () {
    $category = Category::create([
        'name' => 'Test Category',
        'slug' => 'test-category',
        'status' => ActiveInactiveStatus::ACTIVE,
    ]);
    Commission::factory()->create([
        'category_id' => null,
        'commission_type' => CommissionType::Percentage,
        'commission_value' => 10,
        'status' => ActiveInactiveStatus::ACTIVE,
    ]);
    $categoryRule = Commission::factory()->create([
        'category_id' => $category->id,
        'commission_type' => CommissionType::Percentage,
        'commission_value' => 5,
        'status' => ActiveInactiveStatus::ACTIVE,
    ]);

    $resolved = Commission::resolveForCategory($category->id);

    expect($resolved)->not->toBeNull()
        ->and($resolved->id)->toBe($categoryRule->id)
        ->and((float) $resolved->commission_value)->toBe(5.0);
});

it('resolves global commission when no category-specific rule', function () {
    $category = Category::create([
        'name' => 'Other Category',
        'slug' => 'other-category',
        'status' => ActiveInactiveStatus::ACTIVE,
    ]);
    Commission::factory()->create([
        'category_id' => null,
        'commission_type' => CommissionType::Percentage,
        'commission_value' => 7,
        'status' => ActiveInactiveStatus::ACTIVE,
    ]);

    $resolved = Commission::resolveForCategory($category->id);

    expect($resolved)->not->toBeNull()
        ->and($resolved->category_id)->toBeNull()
        ->and((float) $resolved->commission_value)->toBe(7.0);
});

it('computes percentage commission amount', function () {
    $rule = Commission::factory()->create([
        'commission_type' => CommissionType::Percentage,
        'commission_value' => 10,
    ]);

    expect($rule->computeAmount(100.0))->toBe(10.0)
        ->and($rule->computeAmount(55.50))->toBe(5.55);
});

it('computes fixed commission amount', function () {
    $rule = Commission::factory()->create([
        'commission_type' => CommissionType::Fixed,
        'commission_value' => 2.50,
    ]);

    expect($rule->computeAmount(100.0))->toBe(2.5)
        ->and($rule->computeAmount(55.50))->toBe(2.5);
});
