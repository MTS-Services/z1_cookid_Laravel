<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $vendor = Vendor::first();

        if (! $vendor) {
            $this->command->error('No vendor found! Please seed vendors first.');

            return;
        }

        $services = [
            [
                'vendor_id' => $vendor->id,
                'service_name' => 'Elite Exterior Detail',
                'area' => 'Downtown',
                'city' => 'New York',
                'price' => 150.00,
                'status' => 'completed',
                'short_description' => 'Premium exterior hand wash and wax.',
                'description' => 'Our elite exterior detail includes a high-pressure rinse, foam bath, hand dry, and a premium ceramic wax coating for long-lasting shine.',
                'hero_image' => 'https://placehold.net/400x400.png',
                'gallery_images' => json_encode(['https://placehold.net/600x400.png', 'https://placehold.net/600x400.png']),
            ],
            [
                'vendor_id' => $vendor->id,
                'service_name' => 'Full Interior Deep Clean',
                'area' => 'Brooklyn',
                'city' => 'New York',
                'price' => 120.00,
                'status' => 'in_progress',
                'short_description' => 'Complete steam cleaning of seats and carpets.',
                'description' => 'We use industrial-grade steam cleaners to remove stains, odors, and bacteria from your car seats and floor mats.',
                'hero_image' => 'https://placehold.net/400x400.png',
                'gallery_images' => json_encode(['https://placehold.net/600x400.png', 'https://placehold.net/600x400.png']),
            ],
            [
                'vendor_id' => $vendor->id,
                'service_name' => 'Ceramic Coating Pro',
                'area' => 'Manhattan',
                'city' => 'New York',
                'price' => 500.00,
                'status' => 'requested',
                'short_description' => '9H hardness ceramic coating with 2 years warranty.',
                'description' => 'Protect your paint from UV rays, bird droppings, and scratches with our professional ceramic coating service.',
                'hero_image' => 'https://placehold.net/400x400.png',
                'gallery_images' => json_encode(['https://placehold.net/600x400.png', 'https://placehold.net/600x400.png']),
            ],
            [
                'vendor_id' => $vendor->id,
                'service_name' => 'Headlight Restoration',
                'area' => 'Queens',
                'city' => 'New York',
                'price' => 60.00,
                'status' => 'completed',
                'short_description' => 'Make your foggy headlights look brand new.',
                'description' => 'We sand, polish, and apply a UV sealant to restore clarity to your yellowed or foggy headlights.',
                'hero_image' => 'https://placehold.net/400x400.png',
                'gallery_images' => null,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
