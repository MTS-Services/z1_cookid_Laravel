<?php

// Include Frontend Route

use App\Http\Controllers\Auth\GoogleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Google Login Per Guard
|--------------------------------------------------------------------------
*/

Route::get('/auth/google/{guard}', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

include __DIR__.'/settings.php';
include __DIR__.'/frontend.php';
include __DIR__.'/admin.php';
include __DIR__.'/user.php';
include __DIR__.'/vendor.php';
