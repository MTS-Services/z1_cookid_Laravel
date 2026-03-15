<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ActiveInactiveStatus;
use App\Enums\CommissionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Commission\StoreCommissionRequest;
use App\Http\Requests\Admin\Commission\UpdateCommissionRequest;
use App\Models\Category;
use App\Models\Commission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommissionController extends Controller
{
    public function commission(Request $request): Response
    {
        $commissions = Commission::query()
            ->with(['category:id,name'])
            ->orderBy('id')
            ->get()
            ->map(fn (Commission $c) => [
                'id' => $c->id,
                'category_id' => $c->category_id,
                'category_name' => $c->category?->name ?? 'Global (all categories)',
                'commission_type' => $c->commission_type->value,
                'commission_type_label' => $c->commission_type->label(),
                'commission_value' => (float) $c->commission_value,
                'status' => $c->status->value,
                'status_label' => $c->status->label(),
                'created_at' => $c->created_at?->toIso8601String(),
            ]);

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Category $cat) => ['id' => $cat->id, 'name' => $cat->name]);

        $commissionTypes = array_map(
            fn (CommissionType $t) => ['value' => $t->value, 'label' => $t->label()],
            CommissionType::cases()
        );

        $statuses = array_map(
            fn (ActiveInactiveStatus $s) => ['value' => $s->value, 'label' => $s->label()],
            ActiveInactiveStatus::cases()
        );

        return Inertia::render('admin/commission', [
            'commissions' => $commissions,
            'categories' => $categories,
            'commissionTypes' => $commissionTypes,
            'statuses' => $statuses,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }

    public function store(StoreCommissionRequest $request): RedirectResponse
    {
        $admin = $request->user('admin');
        Commission::query()->create([
            'category_id' => $request->validated('category_id'),
            'commission_type' => $request->validated('commission_type'),
            'commission_value' => $request->validated('commission_value'),
            'status' => $request->validated('status'),
            'created_by' => $admin->id,
            'updated_by' => $admin->id,
        ]);

        return redirect()->route('admin.commission')->with('success', 'Commission created successfully.');
    }

    public function update(UpdateCommissionRequest $request, Commission $commission): RedirectResponse
    {
        $admin = $request->user('admin');
        $commission->update([
            'category_id' => $request->validated('category_id'),
            'commission_type' => $request->validated('commission_type'),
            'commission_value' => $request->validated('commission_value'),
            'status' => $request->validated('status'),
            'updated_by' => $admin->id,
        ]);

        return redirect()->route('admin.commission')->with('success', 'Commission updated successfully.');
    }

    public function destroy(Commission $commission): RedirectResponse
    {
        $commission->delete();

        return redirect()->route('admin.commission')->with('success', 'Commission deleted successfully.');
    }
}
