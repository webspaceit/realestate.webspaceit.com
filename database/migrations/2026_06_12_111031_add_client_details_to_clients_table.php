<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('designation')->nullable()->after('contact_person');
            $table->string('phone_mobile')->nullable()->after('phone');
            $table->string('phone_whatsapp')->nullable()->after('phone_mobile');
            $table->date('date_of_birth')->nullable()->after('phone_whatsapp');
            $table->string('nid_no')->nullable()->after('date_of_birth');
            $table->string('tin_no')->nullable()->after('nid_no');
            $table->string('passport_no')->nullable()->after('tin_no');
            $table->string('driving_licence')->nullable()->after('passport_no');
            $table->string('profession')->nullable()->after('driving_licence');
            $table->string('nationality')->nullable()->after('profession');
            $table->string('father_name')->nullable()->after('nationality');
            $table->string('mother_name')->nullable()->after('father_name');
            $table->string('spouse_name')->nullable()->after('mother_name');
            $table->string('spouse_nid_no')->nullable()->after('spouse_name');
            $table->text('present_address')->nullable()->after('spouse_nid_no');
            $table->text('permanent_address')->nullable()->after('present_address');
            $table->text('professional_address')->nullable()->after('permanent_address');
            $table->string('nominee_name')->nullable()->after('professional_address');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn([
                'designation', 'phone_mobile', 'phone_whatsapp', 'date_of_birth',
                'nid_no', 'tin_no', 'passport_no', 'driving_licence', 'profession',
                'nationality', 'father_name', 'mother_name', 'spouse_name',
                'spouse_nid_no', 'present_address', 'permanent_address',
                'professional_address', 'nominee_name',
            ]);
        });
    }
};
