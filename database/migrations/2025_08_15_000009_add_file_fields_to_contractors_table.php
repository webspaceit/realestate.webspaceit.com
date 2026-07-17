<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contractors', function (Blueprint $table) {
            $table->string('nid')->nullable()->after('license_number');
            $table->string('bio_data')->nullable()->after('nid');
            $table->string('deed_of_agreement')->nullable()->after('bio_data');
            $table->string('passport_photo')->nullable()->after('deed_of_agreement');
        });
    }

    public function down(): void
    {
        Schema::table('contractors', function (Blueprint $table) {
            $table->dropColumn(['nid', 'bio_data', 'deed_of_agreement', 'passport_photo']);
        });
    }
};
