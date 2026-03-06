<?php

use App\Enums\VendorStatus;
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
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('shop_name')->nullable();

            // Detailed Location Fields
            $table->string('region_state')->nullable();
            $table->string('city')->nullable();
            $table->string('zip_code')->nullable();
            $table->text('address')->nullable();

            // Google OAuth
            $table->string('google_id')->nullable()->unique();
            $table->string('provider')->nullable();
            $table->string('avatar')->nullable();

            // File Upload
            $table->string('government_id_path')->nullable();

            $table->string('password')->nullable();
            $table->rememberToken();
            $table->string('otp_code')->nullable();
            $table->string('otp_purpose')->nullable();
            $table->timestamp('otp_expires_at')->nullable();
            $table->timestamp('otp_verified_at')->nullable();
            $table->string('status')->default(VendorStatus::Pending->value);
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
