<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Transaction Info
            $table->string('transaction_id')->unique()->nullable();
            $table->string('method')->nullable(); // stripe, paypal

            // Payment Details
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['unpaid', 'paid', 'failed', 'refunded', 'cancelled'])->default('unpaid');

            // Stripe Fields
            $table->string('stripe_payment_intent_id')->nullable();
            $table->string('stripe_charge_id')->nullable();
            $table->string('stripe_customer_id')->nullable();

            // PayPal Fields
            $table->string('paypal_order_id')->nullable();
            $table->string('paypal_capture_id')->nullable();
            $table->string('paypal_payer_id')->nullable();

            // Gateway Response
            $table->text('gateway_response')->nullable();

            // Payment Time
            $table->timestamp('paid_at')->nullable();

            // Refund
            $table->timestamp('refunded_at')->nullable();
            $table->decimal('refund_amount', 10, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
