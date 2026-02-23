<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\UserManagement\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'login'])->name('login.post');
        Route::get('/register', [AdminAuthController::class, 'register'])->name('register');
        Route::post('/register', [AdminAuthController::class, 'registerStore'])->name('register.post');
    });

    Route::middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/all', [AdminController::class, 'index'])->name('index');
        Route::get('/view/detail/{id}', [AdminController::class, 'viewAdmin'])->name('view.detail');
        Route::get('/create', [AdminController::class, 'createAdmin'])->name('create');
        Route::post('/store', [AdminController::class, 'storeAdmin'])->name('store');
        Route::get('/view/edit/{id}', [AdminController::class, 'editAdmin'])->name('edit');
        Route::post('/update', [AdminController::class, 'updateAdmin'])->name('update');
        Route::get('/delete/{id}', [AdminController::class, 'deleteAdmin'])->name('delete');
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

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

    });
});
