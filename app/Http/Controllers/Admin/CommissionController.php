<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CommissionController extends Controller
{
    public function commission(): Response
    {
        return Inertia::render('admin/commission');
    }
}
