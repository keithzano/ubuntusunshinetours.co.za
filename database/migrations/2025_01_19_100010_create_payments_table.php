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
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->string('payment_method')->default('payfast');
            $table->string('transaction_id')->nullable();
            $table->string('payment_id')->nullable(); // PayFast pf_payment_id
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('ZAR');
            $table->string('status')->default('pending'); // pending, completed, failed, cancelled, refunded
            $table->json('gateway_response')->nullable();
            $table->string('payer_email')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            
            $table->index(['transaction_id']);
            $table->index(['booking_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
