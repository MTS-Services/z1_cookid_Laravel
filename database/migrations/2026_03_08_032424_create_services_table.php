<?php

use App\Enums\ActiveInactiveStatus;
use App\Traits\AuditColumnsTrait;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    use AuditColumnsTrait;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendors')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->foreignId('car_type_id')->constrained('car_types')->cascadeOnDelete();
            $table->string('duration');
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->decimal('average_rating', 3, 2)->nullable();
            $table->unsignedInteger('total_reviews')->default(0);
            $table->string('status')->default(ActiveInactiveStatus::ACTIVE->value);

            $table->timestamps();
            $this->addMorphedAuditColumns($table);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
