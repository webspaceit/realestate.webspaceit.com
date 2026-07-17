<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->decimal('land_size_katha', 10, 2)->nullable()->after('budget');
            $table->text('land_details')->nullable()->after('land_size_katha');
            $table->integer('total_unit')->nullable()->after('land_details');
            $table->integer('total_flat')->nullable()->after('total_unit');
            $table->integer('total_floor')->nullable()->after('total_flat');
            $table->integer('total_parking')->nullable()->after('total_floor');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['land_size_katha', 'land_details', 'total_unit', 'total_flat', 'total_floor', 'total_parking']);
        });
    }
};
