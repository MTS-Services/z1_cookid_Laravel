<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }

    public function dashboard(): Response
    {
        return Inertia::render('admin/dashboard');
    }
}
