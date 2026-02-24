<?php

namespace App\Models;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OtpPurpose;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

     protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'email',
        'google_id',
        'provider',
        'avatar',
        'otp_code',
        'otp_purpose',
        'otp_expires_at',
        'otp_verified_at',
        'status',
        'email_verified_at',
    ];

    protected $casts = [
        'status' => ActiveInactiveStatus::class,
        'otp_purpose' => OtpPurpose::class,
        'otp_expires_at' => 'datetime',
        'otp_verified_at' => 'datetime',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    
    protected $hidden = [
        'otp_code',
        'password',
        'remember_token',
    ];

    public function isAdmin()
    {
        return false;
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }
        if (! $this->image) {
            return asset('no-user-image-icon.png');
        }

        return asset('storage/user_images/'.$this->image);
    }
}
