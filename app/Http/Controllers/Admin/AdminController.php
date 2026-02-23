<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function __construct(protected DataTableService $dataTableService) {}

    public function dashboard(): Response
    {
        $stats = [
            'users' => User::count(),
            'users_last_7_days' => User::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        // user type counts
        $counts = User::selectRaw('user_type, count(*) as cnt')->groupBy('user_type')->pluck('cnt', 'user_type')->toArray();

        $userTypeCounts = [];
        foreach (UserType::cases() as $type) {
            $value = $type->value;
            $userTypeCounts[$value] = [
                'label' => $type->label(),
                'count' => $counts[$value] ?? 0,
            ];
        }

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'userTypeCounts' => $userTypeCounts,
        ]);
    }

    public function index(): Response
    {
        $queryBody = Admin::query();

        $result = $this->dataTableService->process($queryBody, request(), [
            'searchable' => ['name', 'email'],
            'sortable' => ['id', 'name', 'email', 'created_at'],
        ]);

        return Inertia::render('admin/all', [
            'admins' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
        ]);
    }

    public function viewAdmin($id)
    {

        $admin = Admin::find($id);
        if (! $admin) {
            abort(404);
        }

        return Inertia::render('admin/view', [
            'admin' => $admin,
        ]);
    }

    public function createAdmin()
    {

        return Inertia::render('admin/create');
    }

    public function storeAdmin(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|unique:admins,username|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string',
            'your_self' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $data['password'] = bcrypt($data['password']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
            $file->storeAs('admin_images', $imageName);
            $data['image'] = $imageName;
        }
        $admin = Admin::create($data);
        if (! $admin) {
            return back()->with('error', 'Admin creation failed.');
        }

        return redirect()->route('admin.index')->with('success', 'Admin created successfully.');
    }

    public function editAdmin($id)
    {

        $admin = Admin::find($id);
        if (! $admin) {
            abort(404);
        }

        return Inertia::render('admin/edit', [
            'admin' => $admin,
        ]);
    }

    public function updateAdmin(Request $request)
    {

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $admin = Admin::find($request->id);
        $admin->update($data);

        return back()->with('success', 'Admin updated successfully.');
    }

    public function deleteAdmin($id)
    {
        $admin = Admin::find($id);
        if (! $admin) {
            abort(404);
        }
        $admin->forceDelete();

        return back()->with('success', 'Admin deleted successfully.');
    }
}
