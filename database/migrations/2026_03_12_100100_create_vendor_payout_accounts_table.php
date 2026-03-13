<?php

use App\Enums\ActiveInactiveStatus;
use App\Traits\AuditColumnsTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    use AuditColumnsTrait, SoftDeletes;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vendor_payout_accounts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vendor_id')->constrained('vendors')->cascadeOnDelete();
            $table->string('account_type');
            $table->string('account_holder_name');
            $table->string('account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('routing_number')->nullable();
            $table->string('email')->nullable();
            $table->string('card_expiry_month')->nullable();
            $table->string('card_expiry_year')->nullable();
            $table->string('security_code')->nullable();
            $table->boolean('is_default')->default(false);
            $table->string('status')->default(ActiveInactiveStatus::ACTIVE->value);

            $table->timestamps();
            $table->softDeletes();
            $this->addMorphedAuditColumns($table);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_payout_accounts');
    }
};
