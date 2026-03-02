<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function __construct()
    {
        // 
    }
    public function index(): Response
    {
        return Inertia::render('vendor/account');
    }
}
