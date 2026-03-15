<?php

use App\Enums\ActiveInactiveStatus;
use App\Enums\CommissionType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->cascadeOnDelete();
            $table->string('commission_type')->default(CommissionType::Percentage->value);
            $table->decimal('commission_value', 8, 2);
            $table->string('status')->default(ActiveInactiveStatus::ACTIVE->value);
            $table->timestamps();

            $table->foreignId('created_by')->nullable()->constrained('admins')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('admins')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};
