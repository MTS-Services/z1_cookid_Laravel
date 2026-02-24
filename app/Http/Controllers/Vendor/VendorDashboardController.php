<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        dd(route('vendor.dashboard'));
        return Inertia::render('vendor/dashboard');
    }
}
