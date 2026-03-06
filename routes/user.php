<?php

use App\Http\Controllers\Auth\User\ForgetPassword;
use App\Http\Controllers\Auth\User\UserAuthController;
use App\Http\Controllers\Auth\User\UserOtpController;
use App\Http\Controllers\User\ProfileController;
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
    // Forgot Password
    Route::get('/forgot-password', [ForgetPassword::class, 'forgotPassword'])->name('forgot-password');
    Route::post('/forgot-password/otp-verify', [ForgetPassword::class, 'forgotPasswordOtpVerify'])->name('forgot-password.otp-verify');
    Route::get('/forgot-password/reset', [ForgetPassword::class, 'forgotPasswordReset'])->name('forgot-password.reset');
    Route::post('/forgot-password/reset', [ForgetPassword::class, 'forgotPasswordResetStore'])->name('forgot-password-reset.store');

    Route::get('/otp-verify', [UserOtpController::class, 'showOtpVerify'])->name('otp-verify');
    Route::post('/otp/verify', [UserOtpController::class, 'verify'])->name('otp.verify');
    Route::post('/otp/resend', [UserOtpController::class, 'resend'])->name('otp.resend');
});

Route::get('/account/pending-verification', [UserController::class, 'accountPending'])->name('user.pending-verification');
Route::middleware(['auth'])->prefix('account')->name('user.')->group(function () {
    Route::controller(UserController::class)->group(function () {
        Route::post('/logout', [UserAuthController::class, 'logout'])->name('logout');
    });
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'index')->name('profile');
        Route::post('/profile', 'profileUpdate')->name('profile.update');
        Route::get('/order-details', 'orderDetails')->name('order-details');
        Route::get('/service-review', 'serviceReview')->name('service-review');
    });
});
