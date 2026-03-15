<?php

namespace Database\Factories;

use App\Enums\ActiveInactiveStatus;
use App\Enums\CommissionType;
use App\Models\Commission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Commission>
 */
class CommissionFactory extends Factory
{
    protected $model = Commission::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => null,
            'commission_type' => CommissionType::Percentage,
            'commission_value' => fake()->randomFloat(2, 1, 20),
            'status' => ActiveInactiveStatus::ACTIVE,
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
