<?php

use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::name('frontend.')->controller(FrontendController::class)->group(function () {

    Route::get('/', 'index')->name('home');
    Route::get('/services', 'services')->name('services');
    Route::get('/categories', 'categories')->name('categories');
    Route::get('/how-it-works', 'howItWorks')->name('how-it-works');
    Route::get('/privacy-policy', 'privacyPolicy')->name('privacy-policy');
});
