<?php

namespace App\Http\Controllers\Admin\FinanceManagement;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    public function __construct()
    {
        // 
    }

    public function index(): Response
    {
        return Inertia::render('admin/finance-management/finance');
    }
}
