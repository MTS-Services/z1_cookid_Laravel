<?php

namespace App\Http\Controllers\Vendor\ListingManagement;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Vendor/ListingManagement/Category/Index');
    }
}
