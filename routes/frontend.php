<?php

use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::name('frontend.')->controller(FrontendController::class)->group(function () {

    Route::get('/', 'index')->name('home');
    Route::get('/privacy-policy', 'privacyPolicy')->name('privacy-policy');
});
