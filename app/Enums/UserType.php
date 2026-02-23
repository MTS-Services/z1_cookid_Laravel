<?php

namespace App\Enums;

enum UserType: string
{
    case PROPERTY_OWNER = 'property_owner';
    case REALTOR = 'realtor';
    case BOTH = 'both';

    public function label(): string
    {
        return match ($this) {
            self::PROPERTY_OWNER => 'Property Owner / Manager',
            self::REALTOR => 'Realtor',
            self::BOTH => 'Both',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::PROPERTY_OWNER => 'success',
            self::REALTOR => 'danger',
            self::BOTH => 'warning',
        };
    }
}
