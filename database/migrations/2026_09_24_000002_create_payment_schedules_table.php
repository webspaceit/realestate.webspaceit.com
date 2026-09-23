<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('payment_schedules')) {
            return; // already created from a partial run
        }

        Schema::create('payment_schedules', function (Blueprint $table) {
            $table->id();
            // Plain unsigned bigint — no FK constraint for cross-engine MySQL compat
            $table->unsignedBigInteger('booking_id');
            $table->string('label', 100)->nullable();
            $table->date('due_date');
            $table->decimal('amount', 15, 2);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->enum('status', ['pending', 'partial', 'paid'])->default('pending');
            $table->date('paid_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['booking_id', 'due_date']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_schedules');
    }
};
