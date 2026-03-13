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
}
