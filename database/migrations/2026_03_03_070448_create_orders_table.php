<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // e.g., #6548-225568
            $table->string('service_name');           // e.g., Elite Auto Spa
            $table->string('vendor_name');            // e.g., Maktech Store
            $table->decimal('price', 10, 2);          // e.g., 100.00
            $table->decimal('commission', 10, 2);     // e.g., 07.00
            $table->decimal('vendor_earning', 10, 2); // e.g., 93.00
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
