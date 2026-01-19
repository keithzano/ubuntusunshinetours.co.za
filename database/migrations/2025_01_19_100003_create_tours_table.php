<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description');
            $table->longText('description');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            
            // Pricing
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('price_type')->default('per_person'); // per_person, per_group
            $table->integer('max_group_size')->nullable();
            
            // Duration
            $table->string('duration'); // e.g., "4 hours", "Full day", "2 days"
            $table->integer('duration_minutes')->nullable();
            
            // Tour details
            $table->json('highlights')->nullable();
            $table->json('includes')->nullable();
            $table->json('excludes')->nullable();
            $table->json('what_to_bring')->nullable();
            $table->json('meeting_point')->nullable();
            $table->text('cancellation_policy')->nullable();
            $table->json('languages')->nullable();
            $table->json('accessibility')->nullable();
            
            // Availability
            $table->json('available_days')->nullable(); // ['monday', 'tuesday', ...]
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->date('available_from')->nullable();
            $table->date('available_until')->nullable();
            $table->integer('min_participants')->default(1);
            $table->integer('max_participants')->nullable();
            $table->integer('booking_cutoff_hours')->default(24);
            
            // Media
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('video_url')->nullable();
            
            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            
            // Stats
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews_count')->default(0);
            $table->integer('bookings_count')->default(0);
            $table->integer('views_count')->default(0);
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_bestseller')->default(false);
            $table->boolean('instant_confirmation')->default(true);
            $table->boolean('free_cancellation')->default(false);
            $table->integer('free_cancellation_hours')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
