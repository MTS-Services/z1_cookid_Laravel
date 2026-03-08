<?php

namespace Database\Factories;

use App\Enums\ActiveInactiveStatus;
use App\Models\CarType;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->randomElement([
            'Elite Auto Spa',
            'Pro Detail Package',
            'Interior Deep Clean',
            'Ceramic Coating',
            'Express Wash & Wax',
        ]);

        return [
            'vendor_id' => Vendor::factory(),
            'category_id' => null,
            'title' => $title,
            'slug' => Str::slug($title).'-'.uniqid(),
            'description' => $this->faker->paragraphs(3, true),
            'car_type_id' => CarType::query()->first() ?? CarType::firstOrCreate(
                ['slug' => 'sedan'],
                ['name' => 'Sedan', 'status' => ActiveInactiveStatus::ACTIVE],
            )->id,
            'duration' => $this->faker->randomElement(['1 hour', '2 hours', 'Half day']),
            'location' => $this->faker->randomElement([
                'Downtown',
                'Uptown',
                'Harbor Side',
                'Airport Zone',
            ]).', '.$this->faker->city(),
            'features' => null,
            'price' => $this->faker->randomFloat(2, 50, 500),
            'image' => null,
            'average_rating' => null,
            'total_reviews' => 0,
            'status' => $this->faker->randomElement([ActiveInactiveStatus::ACTIVE, ActiveInactiveStatus::INACTIVE]),
        ];
    }
}
