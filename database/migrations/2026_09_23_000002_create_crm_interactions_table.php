<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lead_id')->nullable()->index();
            $table->unsignedBigInteger('client_id')->nullable()->index();
            $table->string('type', 50);
            $table->string('subject');
            $table->text('notes')->nullable();
            $table->date('interaction_date');
            $table->unsignedBigInteger('recorded_by_id')->nullable()->index();
            $table->timestamps();

            $table->index(['type']);
            $table->index(['interaction_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interactions');
    }
};