<?php

namespace Database\Factories;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
            'vendor_id' => Vendor::factory(),
            'service_name' => $this->faker->randomElement([
                'Elite Auto Spa',
                'Pro Detail Package',
                'Interior Deep Clean',
                'Ceramic Coating',
                'Express Wash & Wax',
            ]),
            'area' => $this->faker->randomElement([
                'Downtown',
                'Uptown',
                'Harbor Side',
                'Airport Zone',
            ]),
            'city' => $this->faker->city(),
            'price' => $this->faker->randomFloat(2, 50, 500),
            'status' => $this->faker->randomElement(['requested', 'in_progress', 'completed', 'cancelled']),
            'short_description' => $this->faker->sentence(8),
            'description' => $this->faker->paragraphs(3, true),
            'hero_image' => null,
            'gallery_images' => [],
        ];
    }
}
