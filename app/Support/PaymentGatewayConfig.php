<?php

namespace App\Support;

use App\Models\PaymentGatewaySetting;

/**
 * Resolves Stripe / PayPal credentials: database (admin UI) first, then config / .env fallback.
 */
final class PaymentGatewayConfig
{
    private static ?PaymentGatewaySetting $cachedRow = null;

    private static bool $loaded = false;

    public static function forgetCachedRow(): void
    {
        self::$cachedRow = null;
        self::$loaded = false;
    }

    private static function row(): ?PaymentGatewaySetting
    {
        if (! self::$loaded) {
            self::$cachedRow = PaymentGatewaySetting::query()->first();
            self::$loaded = true;
        }

        return self::$cachedRow;
    }

    public static function stripePublishableKey(): string
    {
        $v = self::row()?->stripe_publishable_key;

        return filled($v) ? (string) $v : (string) config('services.stripe.key', '');
    }

    public static function stripeSecret(): string
    {
        $v = self::row()?->stripe_secret;

        return filled($v) ? (string) $v : (string) config('services.stripe.secret', '');
    }

    public static function stripeCurrency(): string
    {
        $v = self::row()?->stripe_currency;

        return filled($v) ? (string) $v : (string) config('services.stripe.currency', 'usd');
    }

    public static function paypalClientId(): string
    {
        $v = self::row()?->paypal_client_id;

        return filled($v) ? (string) $v : (string) config('services.paypal.client_id', '');
    }

    public static function paypalSecret(): string
    {
        $v = self::row()?->paypal_client_secret;

        return filled($v) ? (string) $v : (string) config('services.paypal.secret', '');
    }

    public static function paypalEnvironment(): string
    {
        $v = self::row()?->paypal_environment;
        if (filled($v) && in_array($v, ['sandbox', 'live'], true)) {
            return $v;
        }

        return (string) config('services.paypal.environment', 'sandbox');
    }

    public static function paypalCurrency(): string
    {
        $v = self::row()?->paypal_currency;

        return filled($v) ? (string) $v : (string) config('services.paypal.currency', 'usd');
    }
}
