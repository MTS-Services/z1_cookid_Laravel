# Tow Truck Directory - Project Setup Guide

## Overview
This is a fresh Laravel application for a Tow Truck Directory website in Trinidad. The old project code has been cleaned and replaced with a new system.

## Features Implemented

### Backend (Laravel)
1. **Multi-Guard Authentication System**
   - Admin Guard (for admin panel)
   - Driver Guard (for driver dashboard)
   - Separate authentication flows for each user type

2. **Database Schema**
   - `admins` - Admin users who can approve/remove drivers
   - `drivers` - Tow truck drivers with profiles
   - `service_areas` - Service areas in Trinidad (Port of Spain, San Fernando, etc.)

3. **Controllers**
   - **PublicController** - Public directory page
   - **Admin Controllers** - Login, Dashboard, Driver Management
   - **Driver Controllers** - Login, Register, Dashboard, Profile Management

4. **Models**
   - Admin - Admin user model
   - Driver - Driver model with relationships
   - ServiceArea - Service area model

5. **Middleware**
   - AdminMiddleware - Protects admin routes
   - DriverMiddleware - Protects driver routes (checks approval status)

## Setup Instructions

### 1. Install Dependencies
```bash
composer install
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure your database:
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup
```bash
php artisan migrate:fresh --seed
```

This will create:
- Admin user: `admin@towtruck.com` / `password`
- 10 service areas in Trinidad

### 4. Register Middleware
Add to `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
        'driver' => \App\Http\Middleware\DriverMiddleware::class,
    ]);
})
```

### 5. Build Frontend
```bash
npm run build
# or for development
npm run dev
```

### 6. Start Server
```bash
php artisan serve
```

## Routes

### Public Routes
- `GET /` - Public directory page (shows all approved drivers)

### Admin Routes
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Admin login action
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/drivers` - Driver management page
- `POST /admin/drivers/{driver}/approve` - Approve driver
- `DELETE /admin/drivers/{driver}` - Remove driver
- `POST /admin/logout` - Admin logout

### Driver Routes
- `GET /driver/login` - Driver login page
- `POST /driver/login` - Driver login action
- `GET /driver/register` - Driver registration page
- `POST /driver/register` - Driver registration action
- `GET /driver/dashboard` - Driver dashboard
- `POST /driver/toggle-online` - Toggle online/offline status
- `POST /driver/update-profile` - Update phone number and service area
- `POST /driver/logout` - Driver logout

## Next Steps - Frontend Development

You need to create React/Inertia pages for:

### 1. Public Pages
- `resources/js/pages/Public/Directory.tsx` - Public directory with driver listings and WhatsApp buttons

### 2. Admin Pages
- `resources/js/pages/Admin/Login.tsx` - Admin login form
- `resources/js/pages/Admin/Dashboard.tsx` - Admin dashboard with stats
- `resources/js/pages/Admin/Drivers.tsx` - Driver management table

### 3. Driver Pages
- `resources/js/pages/Driver/Login.tsx` - Driver login form
- `resources/js/pages/Driver/Register.tsx` - Driver registration form
- `resources/js/pages/Driver/Dashboard.tsx` - Driver dashboard with status toggle

## Design Requirements
- Modern, interactive, attractive UI
- Tailwind CSS animations (no JavaScript animations)
- Mobile-friendly responsive design
- WhatsApp integration using `wa.me` links
- Online drivers appear first in listings
- Show service area (general area, not GPS location)

## Database Credentials
- Admin: `admin@towtruck.com` / `password`
- Drivers: Register through `/driver/register`

## Important Notes
- Drivers must be approved by admin before they can login
- Online/Offline status can be toggled by drivers
- Service areas are predefined (no GPS)
- WhatsApp links format: `https://wa.me/1868XXXXXXX`
