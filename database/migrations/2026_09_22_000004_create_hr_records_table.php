<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hr_records', function (Blueprint $table) {
            $table->id();
            $table->string('module', 50)->index();
            $table->foreignId('employee_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title', 191)->nullable();
            $table->text('description')->nullable();
            $table->date('date')->nullable();
            $table->decimal('amount', 14, 2)->nullable();
            $table->string('status', 50)->nullable();
            $table->string('file', 255)->nullable();
            $table->json('data')->nullable();
            $table->timestamps();

            $table->index(['module', 'status']);
            $table->index(['module', 'employee_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hr_records');
    }
};