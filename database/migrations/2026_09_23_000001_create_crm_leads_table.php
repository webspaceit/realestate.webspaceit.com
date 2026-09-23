<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('contact_person');
            $table->string('company_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('source', 50)->nullable();
            $table->string('stage', 50)->default('Inquiry');
            $table->unsignedSmallInteger('probability')->default(10);
            $table->decimal('value', 14, 2)->default(0);
            $table->unsignedBigInteger('assigned_to_id')->nullable()->index();
            $table->date('follow_up_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['stage']);
            $table->index(['follow_up_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};