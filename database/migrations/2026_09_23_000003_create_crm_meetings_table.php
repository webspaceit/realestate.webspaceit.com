<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lead_id')->nullable()->index();
            $table->unsignedBigInteger('client_id')->nullable()->index();
            $table->string('title');
            $table->string('location')->nullable();
            $table->dateTime('scheduled_at');
            $table->string('status', 50)->default('Scheduled');
            $table->text('notes')->nullable();
            $table->text('outcome')->nullable();
            $table->unsignedBigInteger('organizer_id')->nullable()->index();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};