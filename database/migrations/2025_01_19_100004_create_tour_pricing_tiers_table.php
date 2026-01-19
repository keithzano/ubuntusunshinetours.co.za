<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tour_pricing_tiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Adult, Child, Senior, etc.
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('min_age')->nullable();
            $table->integer('max_age')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_pricing_tiers');
    }
};
