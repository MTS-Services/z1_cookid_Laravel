<?php

use App\Http\Controllers\Auth\User\UserAuthController;
use App\Http\Controllers\Auth\User\UserOtpController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;



// ─── User Auth ───────────────────────────────────────────
// Route::get('google',          [GoogleController::class, 'redirect'])->name('google');
// Route::get('google/callback', [GoogleController::class, 'callback'])->name('google.callback');
Route::name('user.auth.')->group(function () {
    Route::get('/login', [UserAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [UserAuthController::class, 'store'])->name('login.post');
    Route::get('/register', [UserAuthController::class, 'register'])->name('register');
    Route::post('/register', [UserAuthController::class, 'registerStore'])->name('register.post');

    Route::get('/otp-verify', [UserOtpController::class, 'showOtpVerify'])->name('otp-verify');
    Route::post('/otp/verify', [UserOtpController::class, 'verify'])->name('otp.verify');
    Route::post('/otp/resend', [UserOtpController::class, 'resend'])->name('otp.resend');
});


Route::get('/account/pending-verification', [UserController::class, 'accountPending'])->name('user.pending-verification');
Route::middleware(['auth'])->prefix('account')->name('user.')->group(function () {
    Route::controller(UserController::class)->group(function () {
        Route::post('/logout', [UserAuthController::class, 'logout'])->name('logout');

        Route::get('/account-settings', 'accountSettings')->name('account-settings');
        Route::post('/account-settings', 'accountSettingsUpdate')->name('account-settings.update');
        Route::get('/license-verification-status', 'licenceVerificationStatus')->name('license-verification-status');
    });
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});
