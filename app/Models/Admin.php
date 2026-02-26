<?php

namespace App\Models;

use App\Enums\ActiveInactiveStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'status',
        'email_verified_at',
        'otp_code',
        'otp_purpose',
        'otp_expires_at',
        'otp_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'otp_expires_at'    => 'datetime',
        'otp_verified_at'   => 'datetime',
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => ActiveInactiveStatus::class,
        ];
    }

    public function approvedDrivers(): HasMany
    {
        return $this->hasMany(Driver::class, 'approved_by');
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

        return asset('storage/user_images/' . $this->image);
    }
}
