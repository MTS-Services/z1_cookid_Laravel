<?php

use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::name('frontend.')->controller(FrontendController::class)->group(function () {

    Route::get('/', 'index')->name('home');
    Route::get('/services', 'services')->name('services');
    Route::get('/service-details/{id?}', 'serviceDetails')->name('service-details');
    Route::get('/categories', 'categories')->name('categories');
    Route::get('/how-it-works', 'howItWorks')->name('how-it-works');
    Route::get('/privacy-policy', 'privacyPolicy')->name('privacy-policy');
    Route::get('/booking-confirm', 'bookingConfirm')->name('booking-confirm');
    Route::get('/vendor-reviews', 'vendorReviews')->name('vendor-reviews');
    Route::get('/store', 'store')->name('store');
    Route::get('/profile', 'profile')->name('profile');
    Route::get('/order-details', 'orderDetails')->name('order-details');
});
