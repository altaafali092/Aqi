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
        Schema::table('municipal_wastes', function (Blueprint $table) {
            $table->unsignedInteger('population_served')->nullable()->after('collection_date');
            $table->unsignedSmallInteger('reporting_period_days')->default(1)->after('population_served');
            $table->string('collection_status', 30)->default('collected')->after('reporting_period_days');
            $table->string('segregation_quality', 30)->default('mixed')->after('collection_status');
            $table->decimal('organic_weight_kg', 8, 2)->nullable()->after('segregation_quality');
            $table->decimal('recyclable_weight_kg', 8, 2)->nullable()->after('organic_weight_kg');
            $table->decimal('hazardous_weight_kg', 8, 2)->nullable()->after('recyclable_weight_kg');
            $table->decimal('medical_weight_kg', 8, 2)->nullable()->after('hazardous_weight_kg');
            $table->unsignedTinyInteger('overflow_spots')->default(0)->after('medical_weight_kg');
            $table->unsignedTinyInteger('odor_level')->default(0)->after('overflow_spots');
            $table->boolean('standing_water')->default(false)->after('odor_level');
            $table->unsignedSmallInteger('missed_collection_days')->default(0)->after('standing_water');
            $table->text('notes')->nullable()->after('missed_collection_days');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('municipal_wastes', function (Blueprint $table) {
            $table->dropColumn([
                'population_served',
                'reporting_period_days',
                'collection_status',
                'segregation_quality',
                'organic_weight_kg',
                'recyclable_weight_kg',
                'hazardous_weight_kg',
                'medical_weight_kg',
                'overflow_spots',
                'odor_level',
                'standing_water',
                'missed_collection_days',
                'notes',
            ]);
        });
    }
};
