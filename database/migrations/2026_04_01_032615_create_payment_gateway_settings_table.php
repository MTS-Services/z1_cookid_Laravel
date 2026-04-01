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
        Schema::create('payment_gateway_settings', function (Blueprint $table) {
            $table->id();
            $table->string('stripe_publishable_key')->nullable();
            $table->text('stripe_secret')->nullable();
            $table->string('stripe_currency', 10)->nullable();
            $table->string('paypal_client_id')->nullable();
            $table->text('paypal_client_secret')->nullable();
            $table->string('paypal_environment', 20)->nullable();
            $table->string('paypal_currency', 10)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_gateway_settings');
    }
};
