<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Completed = 'completed';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
    case Inprogress = 'inprogress';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Completed => 'Completed',
            self::Confirmed => 'Confirmed',
            self::Cancelled => 'Cancelled',
            self::Inprogress => 'In Progress',
        };
    }
}
