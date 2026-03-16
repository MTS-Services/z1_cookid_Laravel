<?php

use App\Models\Admin;
use App\Models\Vendor;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return $user && (int) $user->id === (int) $id;
});

Broadcast::channel('App.Models.Admin.{id}', function ($user, $id) {
    $admin = $user instanceof Admin ? $user : auth('admin')->user();

    return $admin && (int) $admin->id === (int) $id;
}, ['guards' => ['web', 'admin']]);

Broadcast::channel('App.Models.Vendor.{id}', function ($user, $id) {
    $vendor = $user instanceof Vendor ? $user : auth('vendor')->user();

    return $vendor && (int) $vendor->id === (int) $id;
}, ['guards' => ['web', 'vendor']]);
