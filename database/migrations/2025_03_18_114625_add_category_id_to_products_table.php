<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, we need to modify the products table to replace the category string with a foreign key
        Schema::table('products', function (Blueprint $table) {
            // Drop the existing category column (if you've already created it)
            if (Schema::hasColumn('products', 'category')) {
                $table->dropColumn('category');
            }

            // Add the foreign key column
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');

            // Add an index for better performance
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the foreign key constraint and index
            $table->dropForeign(['category_id']);
            $table->dropIndex(['category_id']);
            $table->dropColumn('category_id');

            // Add back the original category column
            $table->string('category')->nullable();
        });
    }
};
