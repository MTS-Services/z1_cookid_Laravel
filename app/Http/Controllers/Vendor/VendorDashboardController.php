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

    public function index(): Response
    {
        return Inertia::render('vendor/notification');
    }
    public function listing(): Response
    {
        return Inertia::render('vendor/listing');
    }
    public function orders(): Response
    {
        return Inertia::render('vendor/orders');
    }
    
}
