<?php

namespace App\Http\Controllers\Admin\CustomerManagement;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(protected DataTableService $dataTableService) {}

    public function index(Request $request): Response
    {
        $query = User::query();

        $result = $this->dataTableService->process($query, $request, [
            'searchable' => ['first_name', 'last_name', 'email', 'phone'],
            'sortable' => ['id', 'first_name', 'last_name', 'created_at'],
        ]);

        return Inertia::render('admin/customer-management/customers/index', [
            'customers' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
        ]);
    }
}
