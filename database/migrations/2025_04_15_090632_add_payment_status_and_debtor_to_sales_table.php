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
        Schema::table('sales', function (Blueprint $table) {
            // Add payment_status field after payment_method
            $table->enum('payment_status', ['paid', 'debt', 'partial'])->default('paid')->after('payment_method');

            // Add customer_name and customer_phone fields
            $table->string('customer_name')->nullable()->after('cashier_name');
            $table->string('customer_phone')->nullable()->after('customer_name');

            // Add a nullable foreign key to debtors table
            $table->foreignId('debtor_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['debtor_id']);
            $table->dropColumn(['payment_status', 'customer_name', 'customer_phone', 'debtor_id']);
        });
    }
};
