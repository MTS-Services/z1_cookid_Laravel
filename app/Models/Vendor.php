<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\VendorStatus;
use App\Enums\OtpPurpose;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

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
        'region_state',
        'city',
        'zip_code',
        'address',
        'government_id_path',
        'profile_photo_path',
        'password',
        'otp_code',
        'otp_purpose',
        'otp_expires_at',
        'otp_verified_at',
        'status',
        'email_verified_at',
    ];

    protected $appends = [
        'profile_photo_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
    ];

    protected $casts = [
        'status' => VendorStatus::class,
        'otp_purpose' => OtpPurpose::class,
        'otp_expires_at' => 'datetime',
        'otp_verified_at' => 'datetime',
        'email_verified_at' => 'datetime',
    ];

    public function getProfilePhotoUrlAttribute(): ?string
    {
        if (! $this->profile_photo_path) {
            return null;
        }

        return Storage::disk('public')->url($this->profile_photo_path);
    }

}
