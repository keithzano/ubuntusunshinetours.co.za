<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('tour_id')->constrained()->onDelete('cascade');
            $table->foreignId('time_slot_id')->nullable()->constrained('tour_time_slots')->onDelete('set null');
            
            // Customer details (for guests or stored for reference)
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->string('customer_country')->nullable();
            
            // Booking details
            $table->date('tour_date');
            $table->time('tour_time')->nullable();
            $table->json('participants'); // [{tier: 'Adult', quantity: 2, price: 500}]
            $table->integer('total_participants');
            $table->text('special_requirements')->nullable();
            
            // Pricing
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->string('discount_code')->nullable();
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('currency')->default('ZAR');
            
            // Status
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed, refunded
            $table->string('payment_status')->default('pending'); // pending, paid, failed, refunded
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            
            // Invoice
            $table->string('invoice_number')->nullable();
            $table->timestamp('invoice_generated_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['booking_reference']);
            $table->index(['customer_email']);
            $table->index(['status']);
            $table->index(['tour_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
