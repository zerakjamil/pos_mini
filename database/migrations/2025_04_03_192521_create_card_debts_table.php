<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('card_debts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('debtor_id')->constrained()->onDelete('cascade');
            $table->string('card_type');
            $table->decimal('card_value', 10, 2);
            $table->integer('quantity')->default(1);
            $table->decimal('amount', 10, 2);
            $table->decimal('balance', 10, 2);
            $table->string('description')->nullable();
            $table->date('due_date');
            $table->enum('status', ['pending', 'partial', 'paid', 'overdue'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_debts');
    }
};
