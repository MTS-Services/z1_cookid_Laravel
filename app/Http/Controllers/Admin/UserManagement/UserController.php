<?php

namespace App\Http\Controllers\Admin\UserManagement;

use App\Concerns\PasswordValidationRules;
use App\Enums\ActiveInactive;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Mail\FoundingUserVerifiedMail;
use App\Models\User;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    use PasswordValidationRules;

    public function __construct(protected DataTableService $dataTableService) {}

    public function index(): Response
    {
        $query = User::query()->where('is_verified', true);

        $result = $this->dataTableService->process($query, request(), [
            'searchable' => ['name', 'email'],
            'sortable' => ['id', 'name', 'email', 'created_at'],
            'filterable' => ['user_type', 'is_verified', 'status'],
        ]);

        return Inertia::render('admin/user-management/users/index', [
            'users' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/user-management/users/create', [
            'user_types' => collect(UserType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'user_type' => ['required', Rule::in(UserType::cases())],
            'your_self' => ['nullable', 'string', 'max:255'],
            'brokerage_name' => ['nullable', 'string', 'max:255'],
            'license_number' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        // File upload logic
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
            $file->storeAs('user_images', $imageName);
            $data['image'] = $imageName;
        }

        $user = User::create($data);
        if (! $user) {
            return redirect()->back()->withErrors(['error' => 'Failed to create user.'])->withInput();
        }

        return redirect()->route('admin.um.users.index');
    }

    public function show($id): Response
    {
        $user = User::findOrFail($id);
        if (! $user) {
            abort(404);
        }

        return Inertia::render('admin/user-management/users/view', ['user' => $user]);
    }

    public function edit($id): Response
    {
        $user = User::findOrFail($id);
        if (! $user) {
            abort(404);
        }

        return Inertia::render('admin/user-management/users/edit', ['user' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if (! $user) {
            abort(404);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'your_self' => ['nullable', 'string', 'max:255'],
            'brokerage_name' => ['nullable', 'string', 'max:255'],
            'license_number' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
        ]);

        if ($request->hasFile('image')) {

            // delete old image
            if ($user->image && Storage::disk('public')->exists('user_images/'.$user->image)) {
                Storage::disk('public')->delete('user_images/'.$user->image);
            }

            // store new image
            $file = $request->file('image');
            $imageName = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
            $file->storeAs('user_images', $imageName);

            $data['image'] = $imageName;
        }

        // unset($validated['image']);

        $user->update($data);

        return redirect()->route('admin.um.users.index');
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (! $user) {
            abort(404);
        }
        $user->delete();

        return redirect()->route('admin.um.users.index');
    }

    public function pendingVerification(): Response
    {
        $queryBody = User::query()->where('is_verified', false);

        $result = $this->dataTableService->process($queryBody, request(), [
            'searchable' => ['name', 'email'],
            'sortable' => ['id', 'name', 'email', 'created_at'],
            'filterable' => ['user_type', 'is_verified', 'status'],
        ]);

        return Inertia::render('admin/user-management/users/pending-verification', [
            'users' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
        ]);
    }

    public function verified($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_verified' => true, 'status' => ActiveInactive::ACTIVE->value]);

        if (! $user) {
            return redirect()->back()->withErrors(['error' => 'Failed to create user.'])->withInput();
        }
        if ($user->email) {
            Mail::to($user->email)->send(new FoundingUserVerifiedMail($user));
        }

        return redirect()->route('admin.um.user.pending-verification');
    }

    public function licenseVerify(Request $request, $id, $status)
    {
        $user = User::findOrFail($id);
        $user->update([
            'license_verification_status' => $status,
        ]);

        return back();
    }
}
