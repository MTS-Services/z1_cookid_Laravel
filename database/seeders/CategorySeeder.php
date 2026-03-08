<?php

namespace Database\Seeders;

use App\Enums\ActiveInactiveStatus;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Exterior Detailing',
                'image' => 'https://placehold.co/400x400?text=Exterior',
            ],
            [
                'name' => 'Interior Care',
                'image' => 'https://placehold.co/400x400?text=Interior',
            ],
            [
                'name' => 'Protective Coatings',
                'image' => 'https://placehold.co/400x400?text=Coatings',
            ],
            [
                'name' => 'Restoration',
                'image' => 'https://placehold.co/400x400?text=Restoration',
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'image' => $category['image'],
                'status' => ActiveInactiveStatus::ACTIVE,
            ]);
        }
    }
}
