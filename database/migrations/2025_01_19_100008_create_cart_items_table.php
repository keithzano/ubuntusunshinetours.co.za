<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');
            $table->foreignId('tour_id')->constrained()->onDelete('cascade');
            $table->foreignId('time_slot_id')->nullable()->constrained('tour_time_slots')->onDelete('set null');
            $table->date('tour_date');
            $table->time('tour_time')->nullable();
            $table->json('participants'); // [{tier_id: 1, name: 'Adult', quantity: 2, price: 500}]
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
