<?php

namespace App\Enums;

enum AccountTypeMethod: string
{
    case CARD = 'card';
    case PAYPAL = 'paypal';
    case STRIPE = 'stripe';

    public function label(): string
    {
        return match ($this) {
            self::CARD => 'Card',
            self::PAYPAL => 'Paypal',
            self::STRIPE => 'Stripe',
        };
    }

    public function value(): string
    {
        return match ($this) {
            self::CARD => 'card',
            self::PAYPAL => 'paypal',
            self::STRIPE => 'stripe',
        };
    }
}
