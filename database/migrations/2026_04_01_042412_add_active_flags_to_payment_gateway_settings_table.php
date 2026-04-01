<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payment_gateway_settings', function (Blueprint $table) {
            $table->boolean('stripe_active')->default(true)->after('stripe_currency');
            $table->boolean('paypal_active')->default(true)->after('paypal_currency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_gateway_settings', function (Blueprint $table) {
            $table->dropColumn(['stripe_active', 'paypal_active']);
        });
    }
};
