<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('frontend/index');
    }
    public function search($id = null): Response
    {
        return Inertia::render('frontend/search-page');
    }
    public function privacyPolicy(): Response
    {
        return Inertia::render('frontend/privacy-policy');
    }
    public function services(): Response
    {
        return Inertia::render('frontend/services');
    }
    public function serviceDetails($id = null): Response
    {
        return Inertia::render('frontend/service-details');
    }
    public function bookingConfirm(): Response
    {
        return Inertia::render('frontend/booking-confirmation');
    }
    public function categories(): Response
    {
        return Inertia::render('frontend/categories');
    }
    public function howItWorks(): Response
    {
        return Inertia::render('frontend/how-it-work');
    }
    public function vendorReviews(): Response
    {
        return Inertia::render('frontend/vendor-reviews');
    }
    public function store(): Response
    {
        return Inertia::render('frontend/store');
    }
}
