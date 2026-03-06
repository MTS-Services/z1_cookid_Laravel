<?php

use App\Http\Controllers\Auth\Vendor\ForgetPassword;
use App\Http\Controllers\Auth\Vendor\VendorAuthController;
use App\Http\Controllers\Auth\Vendor\VendorOtpController;
use App\Http\Controllers\Vendor\AccountController;
use App\Http\Controllers\Vendor\PaymentController;
use App\Http\Controllers\Vendor\PerformanceController;
use App\Http\Controllers\Vendor\VendorDashboardController;
use Illuminate\Support\Facades\Route;

// ─── Vendor Auth ──────────────────────────────────────────
Route::prefix('vendor/auth')->name('vendor.auth.')->group(function () {
    Route::get('login', [VendorAuthController::class, 'showLogin'])->name('login');
    Route::post('login', [VendorAuthController::class, 'login'])->name('login');
    Route::get('register', [VendorAuthController::class, 'showRegister'])->name('register');
    Route::post('register', [VendorAuthController::class, 'register'])->name('register');
    Route::post('login/verify', [VendorAuthController::class, 'loginVerify'])->name('login.verify');

    Route::get('forgot-password', [ForgetPassword::class, 'forgotPassword'])->name('forgot-password');
    Route::post('forgot-password/otp-verify', [ForgetPassword::class, 'forgotPasswordOtpVerify'])->name('forgot-password.otp-verify');
    Route::get('forgot-password/reset', [ForgetPassword::class, 'forgotPasswordReset'])->name('forgot-password.reset');
    Route::post('forgot-password/reset', [ForgetPassword::class, 'forgotPasswordResetStore'])->name('forgot-password-reset.store');

    Route::get('otp-verify', [VendorOtpController::class, 'showOtpVerify'])->name('otp-verify');
    Route::post('otp/verify', [VendorOtpController::class, 'verify'])->name('otp.verify');
    Route::post('otp/resend', [VendorOtpController::class, 'resend'])->name('otp.resend');
});

Route::middleware('vendor')->prefix('vendor')->name('vendor.')->group(function () {
    Route::post('logout', [VendorAuthController::class, 'logout'])->name('logout');
    Route::get('dashboard', [VendorDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('notification', [VendorDashboardController::class, 'notification'])->name('notification');
    Route::get('listing', [VendorDashboardController::class, 'listing'])->name('listing');
    Route::get('listing/create', [VendorDashboardController::class, 'listingCreate'])->name('listing.create');
    Route::get('orders', [VendorDashboardController::class, 'orders'])->name('orders');
    Route::get('order-candelled-details', [VendorDashboardController::class, 'orderCandelledDetails'])->name('order-candelled-details');
    Route::get('order-details', [VendorDashboardController::class, 'orderDetails'])->name('order-details');
    Route::get('payments', [PaymentController::class, 'index'])->name('payments');
    Route::get('performance', [PerformanceController::class, 'index'])->name('performance');
    Route::get('account', [AccountController::class, 'index'])->name('account');
    Route::patch('account', [AccountController::class, 'update'])->name('account.update');
});
