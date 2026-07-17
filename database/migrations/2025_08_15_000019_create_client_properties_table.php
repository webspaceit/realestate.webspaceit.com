<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained()->cascadeOnDelete();
            $table->date('ownership_start')->nullable();
            $table->date('ownership_end')->nullable();
            $table->timestamps();

            $table->unique(['client_id', 'unit_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_properties');
    }
};
