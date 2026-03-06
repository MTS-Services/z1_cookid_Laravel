<?php

use App\Traits\AuditColumnsTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    use SoftDeletes, AuditColumnsTrait;
    
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained()->cascadeOnDelete();

            $table->string('service_name');
            $table->string('area');
            $table->string('city')->nullable();
            $table->decimal('price', 10, 2);

            $table->enum('status', ['requested', 'in_progress', 'completed', 'cancelled'])->default('requested');

            $table->string('short_description')->nullable();
            $table->text('description')->nullable();
            $table->string('hero_image')->nullable();
            $table->json('gallery_images')->nullable();

            $table->timestamps();
            $table->softDeletes();
            $this->addMorphedAuditColumns($table);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
