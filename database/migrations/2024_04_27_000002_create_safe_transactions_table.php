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
        Schema::create('safe_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('transaction_number');
            $table->string('transaction_type');
            $table->uuid('sender_id')->nullable();
            $table->foreign('sender_id')->references('id')->on('safe_accounts');
            $table->uuid('receiver_id')->nullable();
            $table->foreign('receiver_id')->references('id')->on('safe_accounts');
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('safe_transactions');
    }
};