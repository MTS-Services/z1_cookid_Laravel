<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CommissionController;
use App\Http\Controllers\Admin\CustomerManagement\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FinanceManagement\FinanceController;
use App\Http\Controllers\Admin\FinanceManagement\VendorWithdrawalController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\OrderManagement\OrderController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ServiceManagement\ServiceController;
use App\Http\Controllers\Admin\UserManagement\UserController;
use App\Http\Controllers\Admin\VendorManagement\VendorController;
use App\Http\Controllers\Auth\Admin\AdminAuthController;
use App\Http\Controllers\Auth\Admin\AdminOtpController;
use App\Http\Controllers\Auth\Admin\ForgetPassword;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'login'])->name('login.post');
        Route::get('/register', [AdminAuthController::class, 'register'])->name('register');
        Route::post('/register', [AdminAuthController::class, 'registerStore'])->name('register.post');

        Route::get('/forgot-password', [ForgetPassword::class, 'forgotPassword'])->name('forgot-password');
        Route::post('/forgot-password/otp-verify', [ForgetPassword::class, 'forgotPasswordOtpVerify'])->name('forgot-password.otp-verify');
        Route::get('/forgot-password/reset', [ForgetPassword::class, 'forgotPasswordReset'])->name('forgot-password.reset');
        Route::post('/forgot-password/reset', [ForgetPassword::class, 'forgotPasswordResetStore'])->name('forgot-password-reset.store');

        Route::get('/otp-verify', [AdminOtpController::class, 'showOtpVerify'])->name('otp-verify');
        Route::post('/otp/verify', [AdminOtpController::class, 'verify'])->name('otp.verify');
        Route::post('/otp/resend', [AdminOtpController::class, 'resend'])->name('otp.resend');
    });

    Route::middleware('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
        Route::get('/notification', [NotificationController::class, 'index'])->name('notification');
        Route::post('/notification/mark-all-read', [NotificationController::class, 'markAllRead'])->name('notification.mark-all-read');
        Route::post('/notification/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notification.read');
        Route::get('/all', [AdminController::class, 'index'])->name('index');
        Route::get('/view/detail/{id}', [AdminController::class, 'viewAdmin'])->name('view.detail');
        Route::get('/create', [AdminController::class, 'createAdmin'])->name('create');
        Route::post('/store', [AdminController::class, 'storeAdmin'])->name('store');
        Route::get('/view/edit/{id}', [AdminController::class, 'editAdmin'])->name('edit');
        Route::post('/update', [AdminController::class, 'updateAdmin'])->name('update');
        Route::get('/delete/{id}', [AdminController::class, 'deleteAdmin'])->name('delete');
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

        Route::controller(ProfileController::class)->prefix('profile')->name('profile.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::patch('/', 'update')->name('update');
        });

        Route::group(['prefix' => 'users', 'as' => 'um.'], function () {
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
            Route::get('/user/create', [UserController::class, 'create'])->name('user.create');
            Route::post('/user/store', [UserController::class, 'store'])->name('user.store');
            Route::get('/user/{id}/view', [UserController::class, 'show'])->name('user.view');
            Route::get('/user/{id}/edit', [UserController::class, 'edit'])->name('user.edit');
            Route::put('/user/{id}', [UserController::class, 'update'])->name('user.update');
            Route::get('/users/{id}', [UserController::class, 'destroy'])->name('user.destroy');
            Route::get('/pending-verification', [UserController::class, 'pendingVerification'])->name('user.pending-verification');
            Route::get('/user/verify/{id}', [UserController::class, 'verified'])->name('user.verify');
            Route::post('/user/license-verify/{id}/{status}', [UserController::class, 'licenseVerify'])->name('user.license-verify');
        });

        Route::group(['prefix' => 'finance-management', 'as' => 'fm.'], function () {
            Route::get('/finance', [FinanceController::class, 'index'])->name('index');
            Route::get('/withdrawals', [VendorWithdrawalController::class, 'index'])->name('withdrawals.index');
            Route::get('/withdrawals/{withdrawal}', [VendorWithdrawalController::class, 'show'])->name('withdrawals.show');
            Route::post('/withdrawals/{withdrawal}/approve', [VendorWithdrawalController::class, 'approve'])->name('withdrawals.approve');
            Route::post('/withdrawals/{withdrawal}/reject', [VendorWithdrawalController::class, 'reject'])->name('withdrawals.reject');
            Route::post('/withdrawals/{withdrawal}/mark-processing', [VendorWithdrawalController::class, 'markProcessing'])->name('withdrawals.mark-processing');
            Route::post('/withdrawals/{withdrawal}/mark-completed', [VendorWithdrawalController::class, 'markCompleted'])->name('withdrawals.mark-completed');
        });

        Route::group(['prefix' => 'vendor-management', 'as' => 'vm.'], function () {
            Route::get('/vendors', [VendorController::class, 'index'])->name('vendors.index');
            Route::get('/vendors/{id}', [VendorController::class, 'show'])->name('vendors.show');
            Route::post('/vendors/{id}/approve', [VendorController::class, 'approve'])->name('vendors.approve');
            Route::post('/vendors/{id}/reject', [VendorController::class, 'reject'])->name('vendors.reject');
        });

        Route::group(['prefix' => 'service-management', 'as' => 'sm.'], function () {
            Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
            Route::get('/services/{service}', [ServiceController::class, 'show'])->name('services.show');
            Route::post('/services/{service}/approve', [ServiceController::class, 'approve'])->name('services.approve');
            Route::post('/services/{service}/cancel', [ServiceController::class, 'cancel'])->name('services.cancel');
        });

        Route::group(['prefix' => 'customer-management', 'as' => 'cm.'], function () {
            Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
            Route::get('/customers/{id}', [CustomerController::class, 'show'])->name('customers.show');
        });

        Route::group(['prefix' => 'order-management', 'as' => 'om.'], function () {
            Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        });

        Route::get('/commission', [CommissionController::class, 'commission'])->name('commission');
    });
});
