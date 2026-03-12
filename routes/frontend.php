<?php

use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\FrontendController;
use App\Http\Controllers\Frontend\ServiceController;
use Illuminate\Support\Facades\Route;

Route::name('frontend.')->controller(FrontendController::class)->group(function () {

    Route::get('/', 'index')->name('home');
    Route::get('/categories', 'categories')->name('categories');
    Route::get('/how-it-works', 'howItWorks')->name('how-it-works');
    Route::get('/privacy-policy', 'privacyPolicy')->name('privacy-policy');
    Route::get('/booking-confirm', 'bookingConfirm')->name('booking-confirm');
    Route::get('/vendor-reviews/{id}', 'vendorReviews')->name('vendor-reviews');
    Route::get('/services-store/{id}', 'servicesStore')->name('services-store');
    Route::get('/search/{id?}', 'search')->name('search');
    Route::get('/about-us', 'aboutUs')->name('about-us');
});

Route::name('frontend.')->controller(ServiceController::class)->group(function () {
    Route::get('/services', 'index')->name('services');
    Route::get('/service-details/{id}', 'show')->name('service-details');
});

Route::name('frontend.')->controller(ContactController::class)->group(function () {
    Route::get('/contact', 'index')->name('contact');
});