<?php

namespace App\Http\Controllers\Vendor\ListingManagement;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('vendor/listing-management/listing/index');
    }

    public function create(): Response
    {
        return Inertia::render('vendor/listing-management/listing/create');
    }
}
