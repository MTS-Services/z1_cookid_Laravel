<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\ActiveInactiveStatus;
use App\Enums\OtpPurpose;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vendor extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'shop_name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'location',
        'password',
        'otp_code',
        'otp_purpose',
        'otp_expires_at',
        'otp_verified_at',
        'status',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
    ];

    protected $casts = [
        'status' => ActiveInactiveStatus::class,
        'otp_purpose' => OtpPurpose::class,
        'otp_expires_at' => 'datetime',
        'otp_verified_at' => 'datetime',
        'email_verified_at' => 'datetime',
    ];
    
}
