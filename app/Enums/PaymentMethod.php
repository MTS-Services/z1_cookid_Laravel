<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Stripe = 'stripe';
    case Paypal = 'paypal';

    public function label(): string
    {
        return match ($this) {
            self::Stripe => 'Stripe',
            self::Paypal => 'PayPal',
        };
    }
}
