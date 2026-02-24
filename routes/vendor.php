<?php

use App\Http\Controllers\Auth\Vendor\VendorAuthController;
use App\Http\Controllers\Auth\Vendor\VendorOtpController;
use App\Http\Controllers\Vendor\VendorDashboardController;
use Illuminate\Support\Facades\Route;






// ─── Vendor Auth ──────────────────────────────────────────
Route::prefix('vendor/auth')->name('vendor.auth.')->group(function () {
    Route::get('login', [VendorAuthController::class, 'showLogin'])->name('login');
    Route::post('login',        [VendorAuthController::class, 'login'])->name('login');
    Route::get('register', [VendorAuthController::class, 'showRegister'])->name('register');
    Route::post('register',     [VendorAuthController::class, 'register'])->name('register');
    Route::post('login/verify', [VendorAuthController::class, 'loginVerify'])->name('login.verify');
    Route::post('logout',       [VendorAuthController::class, 'logout'])->name('logout');
    Route::get('otp-verify', [VendorOtpController::class, 'showOtpVerify'])->name('otp-verify');
    Route::post('otp/verify',   [VendorOtpController::class, 'verify'])->name('otp.verify');
    Route::post('otp/resend',   [VendorOtpController::class, 'resend'])->name('otp.resend');
});

Route::middleware('vendor')->prefix('vendor')->name('vendor.')->group(function () {
    Route::get('dashboard', [VendorDashboardController::class, 'index'])->name('dashboard');
});