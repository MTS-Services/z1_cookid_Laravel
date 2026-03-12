<?php

namespace App\Models;

use App\Enums\OtpPurpose;
use App\Enums\VendorStatus;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
        'government_issue_license',
        'avatar',
        'password',
        'otp_code',
        'otp_purpose',
        'otp_expires_at',
        'otp_verified_at',
        'status',
        'email_verified_at',

        'creater_id',
        'updater_id',
        'deleter_id',
        
        'creater_type',
        'updater_type',
        'deleter_type',
    ];

    protected $appends = [
        'avatar_url',
        'license_url',
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

    public function getAvatarUrlAttribute(): ?string
    {
        if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
            return $this->avatar;
        }
        if (! $this->avatar) {
            return asset('no-user-image-icon.png');
        }

        return asset('storage/vendor_avatars/'.$this->avatar);
    }
    public function getLicenseUrlAttribute(): ?string
    {
        if (filter_var($this->government_issue_license, FILTER_VALIDATE_URL)) {
            return $this->government_issue_license;
        }
        if (! $this->government_issue_license) {
            return null;
        }

        return asset('storage/'.$this->government_issue_license);
    }

    public function balance(): HasOne
    {
        return $this->hasOne(VendorBalance::class);
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(VendorEarning::class);
    }

    public function withdrawals(): HasMany
    {
        return $this->hasMany(VendorWithdrawal::class);
    }
}

