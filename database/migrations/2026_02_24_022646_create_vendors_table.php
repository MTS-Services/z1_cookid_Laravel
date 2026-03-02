<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('shop_name');

            // Detailed Location Fields
            $table->string('region_state')->nullable();
            $table->string('city')->nullable();
            $table->string('zip_code')->nullable();
            $table->text('address')->nullable();

            // File Upload
            $table->string('government_id_path')->nullable();
            $table->string('profile_photo_path')->nullable();

            $table->string('password');
            $table->rememberToken();
            $table->string('otp_code')->nullable();
            $table->enum('otp_purpose', ['login', 'register', 'reset_password'])->nullable();
            $table->timestamp('otp_expires_at')->nullable();
            $table->timestamp('otp_verified_at')->nullable();
            $table->enum('status', ['active', 'inactive', 'banned'])->default('inactive');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
