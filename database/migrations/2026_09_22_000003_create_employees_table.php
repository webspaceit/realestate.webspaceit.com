<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();

            // ---- 1. Personal Information ----
            $table->string('employee_id')->unique();
            $table->string('full_name');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('email')->nullable();
            $table->string('mobile')->nullable();
            $table->string('emergency_mobile')->nullable();
            $table->date('dob')->nullable();
            $table->text('present_address')->nullable();
            $table->text('permanent_address')->nullable();
            $table->string('marital_status')->nullable(); // unmarried, married, divorced
            $table->string('passport_no')->nullable();
            $table->string('blood_group')->nullable(); // A+, A-, B+, B-, AB+, AB-, O+, O-
            $table->string('gender')->nullable(); // male, female, transgender
            $table->integer('age')->nullable();
            $table->string('religion')->nullable(); // islam, hinduism, christianity, buddhism
            $table->string('national_id')->nullable();
            $table->string('photo')->nullable();
            $table->string('nationality')->nullable();
            $table->string('status')->default('active'); // active, inactive

            // ---- 2. Position Details ----
            $table->date('date_of_joining')->nullable();
            $table->string('position_applied_for')->nullable();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('designation_id')->nullable()->constrained()->nullOnDelete();
            $table->string('designation_level')->nullable();
            $table->string('employment_type')->nullable(); // full_time, part_time, contractual, internship
            $table->decimal('monthly_salary', 14, 2)->nullable();
            $table->string('functional_superior_name')->nullable();

            // ---- 3. Educational Qualifications ----
            $table->string('highest_degree')->nullable();
            $table->string('institution')->nullable();
            $table->string('passing_year')->nullable();
            $table->string('cgpa')->nullable();

            // ---- 4. Certificate Attachments ----
            $table->string('certificate_1')->nullable();
            $table->string('certificate_2')->nullable();
            $table->string('certificate_3')->nullable();
            $table->string('certificate_4')->nullable();
            $table->string('certificate_5')->nullable();
            $table->string('certificate_6')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};