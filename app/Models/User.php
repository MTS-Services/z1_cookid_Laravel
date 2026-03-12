<?php

namespace App\Models;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OtpPurpose;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'password',

        'creater_id',
        'updater_id',
        'deleter_id',
        
        'creater_type',
        'updater_type',
        'deleter_type',
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

    protected $appends = ['avatar_url', 'full_name'];

    public function getAvatarUrlAttribute()
    {
        if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
            return $this->avatar;
        }
        if (! $this->avatar) {
            return asset('no-user-image-icon.png');
        }

        return asset('storage/user_images/' . $this->avatar);
    }
    // Full name accessor
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function orderAddresses(): HasMany
    {
        return $this->hasMany(OrderAddress::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
