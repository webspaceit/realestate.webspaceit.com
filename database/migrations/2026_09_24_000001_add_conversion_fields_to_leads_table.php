<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            if (!Schema::hasColumn('leads', 'converted_client_id')) {
                $table->unsignedBigInteger('converted_client_id')->nullable()->after('notes');
                $table->index('converted_client_id');
            }
            if (!Schema::hasColumn('leads', 'converted_at')) {
                $table->timestamp('converted_at')->nullable()->after('converted_client_id');
            }
        });

        // Drop any leftover broken FK constraint from the first failed attempt
        try {
            Schema::table('leads', function (Blueprint $table) {
                $table->dropForeign(['converted_client_id']);
            });
        } catch (\Throwable $e) {
            // FK didn't exist or already dropped — safe to ignore
        }
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            if (Schema::hasColumn('leads', 'converted_client_id')) {
                $table->dropIndex(['converted_client_id']);
                $table->dropColumn('converted_client_id');
            }
            if (Schema::hasColumn('leads', 'converted_at')) {
                $table->dropColumn('converted_at');
            }
        });
    }
};
