<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            // Nullable unsigned bigint — no DB-level FK constraint for cross-engine compatibility
            $table->unsignedBigInteger('converted_client_id')->nullable()->after('notes');
            $table->timestamp('converted_at')->nullable()->after('converted_client_id');
            $table->index('converted_client_id');
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropIndex(['converted_client_id']);
            $table->dropColumn(['converted_client_id', 'converted_at']);
        });
    }
};
