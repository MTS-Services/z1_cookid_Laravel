<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class VendorDashboardController extends Controller
{
    public function __construct()
    {
    //    
    }

    public function dashboard(): Response
    {
        return Inertia::render('vendor/dashboard');
    }

    public function notification(): Response
    {
        return Inertia::render('vendor/notification');
    }
    public function listing(): Response
    {
        return Inertia::render('vendor/listing');
    }
    public function listingCreate(): Response
    {
        return Inertia::render('vendor/listing-create');
    }
    public function orders(): Response
    {
        return Inertia::render('vendor/orders');
    }
    public function orderDetails(): Response
    {
        return Inertia::render('vendor/order-details');
    }
    public function orderCandelledDetails(): Response
    {
        return Inertia::render('vendor/order-candelled-details');
    }
    
}
