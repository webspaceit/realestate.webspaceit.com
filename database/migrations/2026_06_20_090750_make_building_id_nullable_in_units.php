<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->foreignId('building_id')->nullable()->change();
            $table->dropUnique(['building_id', 'unit_number']);
        });
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->foreignId('building_id')->nullable(false)->change();
            $table->unique(['building_id', 'unit_number']);
        });
    }
};