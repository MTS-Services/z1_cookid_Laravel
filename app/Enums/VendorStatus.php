<?php

namespace App\Enums;

enum VendorStatus: string
{
    case Pending = 'inactive';
    case Active = 'active';
    case Suspended = 'banned';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Active => 'Active',
            self::Suspended => 'Suspended',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Active => 'success',
            self::Suspended => 'danger',
        };
    }
}
