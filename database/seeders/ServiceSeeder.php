<?php

namespace Database\Seeders;

use App\Enums\ActiveInactiveStatus;
use App\Models\CarType;
use App\Models\Category;
use App\Models\Service;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $vendor = Vendor::first();
        $category = Category::first();
        $carType = CarType::first();

        if (! $vendor) {
            $this->command->error('No vendor found! Please seed vendors first.');

            return;
        }

        if (! $category) {
            $this->command->error('No category found! Please seed categories first.');

            return;
        }

        if (! $carType) {
            $this->command->error('No car type found! Please seed car types first.');

            return;
        }

        $services = [
            [
                'vendor_id' => $vendor->id,
                'category_id' => $category->id,
                'title' => 'Elite Exterior Detail',
                'slug' => Str::slug('Elite Exterior Detail'),
                'description' => 'Our elite exterior detail includes a high-pressure rinse, foam bath, hand dry, and a premium ceramic wax coating for long-lasting shine.',
                'car_type_id' => $carType->id,
                'duration' => '2 hours',
                'price' => 150.00,
                'image' => 'https://placehold.co/600x400?text=Exterior+Detail',
                'average_rating' => 4.8,
                'total_reviews' => 132,
                'status' => ActiveInactiveStatus::ACTIVE,
            ],
            [
                'vendor_id' => $vendor->id,
                'category_id' => $category->id,
                'title' => 'Full Interior Deep Clean',
                'slug' => Str::slug('Full Interior Deep Clean'),
                'description' => 'We use industrial-grade steam cleaners to remove stains, odors, and bacteria from your car seats and floor mats.',
                'car_type_id' => $carType->id,
                'duration' => '90 minutes',
                'price' => 120.00,
                'image' => 'https://placehold.co/600x400?text=Interior+Deep+Clean',
                'average_rating' => 4.6,
                'total_reviews' => 87,
                'status' => ActiveInactiveStatus::ACTIVE,
            ],
            [
                'vendor_id' => $vendor->id,
                'category_id' => $category->id,
                'title' => 'Ceramic Coating Pro',
                'slug' => Str::slug('Ceramic Coating Pro'),
                'description' => 'Protect your paint from UV rays, bird droppings, and scratches with our professional ceramic coating service.',
                'car_type_id' => $carType->id,
                'duration' => '1 day',
                'price' => 500.00,
                'image' => 'https://placehold.co/600x400?text=Ceramic+Coating',
                'average_rating' => 4.9,
                'total_reviews' => 56,
                'status' => ActiveInactiveStatus::ACTIVE,
            ],
            [
                'vendor_id' => $vendor->id,
                'category_id' => $category->id,
                'title' => 'Headlight Restoration',
                'slug' => Str::slug('Headlight Restoration'),
                'description' => 'We sand, polish, and apply a UV sealant to restore clarity to your yellowed or foggy headlights.',
                'car_type_id' => $carType->id,
                'duration' => '45 minutes',
                'price' => 60.00,
                'image' => 'https://placehold.co/600x400?text=Headlight+Restoration',
                'average_rating' => 4.4,
                'total_reviews' => 43,
                'status' => ActiveInactiveStatus::ACTIVE,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
