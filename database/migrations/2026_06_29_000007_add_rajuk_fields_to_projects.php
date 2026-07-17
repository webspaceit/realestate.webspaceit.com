<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->date('rajuk_file_submit_date')->nullable()->after('land_details');
            $table->string('rajuk_permission_status')->default('not_submitted')->after('rajuk_file_submit_date');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['rajuk_file_submit_date', 'rajuk_permission_status']);
        });
    }
};
