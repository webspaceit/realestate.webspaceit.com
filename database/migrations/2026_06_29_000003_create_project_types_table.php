<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        $types = [
            ['name' => 'Residential Project', 'slug' => 'residential'],
            ['name' => 'Commercial Project', 'slug' => 'commercial'],
            ['name' => 'Mixed Use Project', 'slug' => 'mixed-use'],
            ['name' => 'Industrial Project', 'slug' => 'industrial'],
            ['name' => 'Interior Project', 'slug' => 'interior'],
            ['name' => 'Land Share Project', 'slug' => 'land-share'],
            ['name' => 'Others', 'slug' => 'others'],
        ];

        foreach ($types as $type) {
            DB::table('project_types')->insert($type + [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('project_types');
    }
};
