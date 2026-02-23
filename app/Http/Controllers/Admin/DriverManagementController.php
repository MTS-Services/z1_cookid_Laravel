<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\ServiceArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DriverManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Driver::with('serviceArea', 'approvedBy')->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'approved') {
                $query->where('is_approved', true);
            } elseif ($status === 'pending') {
                $query->where('is_approved', false);
            } elseif ($status === 'online') {
                $query->where('is_approved', true)->where('is_online', true);
            }
        }

        $drivers = $query->paginate(10)->through(function ($driver) {
            return [
                'id' => $driver->id,
                'name' => $driver->name,
                'email' => $driver->email,
                'phone_number' => $driver->phone_number,
                'service_area_id' => $driver->service_area_id,
                'service_area' => $driver->serviceArea?->name,
                'is_approved' => $driver->is_approved,
                'is_online' => $driver->is_online,
                'approved_by' => $driver->approvedBy?->name,
                'approved_at' => $driver->approved_at?->format('M d, Y'),
                'created_at' => $driver->created_at->format('M d, Y'),
            ];
        });

        $serviceAreas = ServiceArea::orderBy('name')->pluck('name', 'id');

        return Inertia::render('Admin/Drivers', [
            'drivers' => $drivers,
            'serviceAreas' => $serviceAreas,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:drivers,email'],
            'phone_number' => ['required', 'string', 'max:20'],
            'service_area_id' => ['required', 'exists:service_areas,id'],
            'password' => ['required', 'string', 'min:8'],
            'is_approved' => ['boolean'],
        ]);

        $driver = Driver::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'service_area_id' => $validated['service_area_id'],
            'password' => Hash::make($validated['password']),
            'is_approved' => $validated['is_approved'] ?? false,
            'approved_at' => ($validated['is_approved'] ?? false) ? now() : null,
            'approved_by' => ($validated['is_approved'] ?? false) ? Auth::guard('admin')->id() : null,
        ]);

        return back()->with('success', 'Driver created successfully.');
    }

    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('drivers', 'email')->ignore($driver->id)],
            'phone_number' => ['required', 'string', 'max:20'],
            'service_area_id' => ['required', 'exists:service_areas,id'],
            'password' => ['nullable', 'string', 'min:8'],
            'is_approved' => ['boolean'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'service_area_id' => $validated['service_area_id'],
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        if (isset($validated['is_approved'])) {
            $wasApproved = $driver->is_approved;
            $updateData['is_approved'] = $validated['is_approved'];

            if ($validated['is_approved'] && ! $wasApproved) {
                $updateData['approved_at'] = now();
                $updateData['approved_by'] = Auth::guard('admin')->id();
            }
        }

        $driver->update($updateData);

        return back()->with('success', 'Driver updated successfully.');
    }

    public function approve(Request $request, Driver $driver)
    {
        $driver->update([
            'is_approved' => true,
            'approved_at' => now(),
            'approved_by' => Auth::guard('admin')->id(),
        ]);

        return back()->with('success', 'Driver approved successfully.');
    }

    public function destroy(Driver $driver)
    {
        $driver->delete();

        return back()->with('success', 'Driver removed successfully.');
    }
}
