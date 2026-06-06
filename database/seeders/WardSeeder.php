<?php

namespace Database\Seeders;

use App\Models\Ward;
use Illuminate\Database\Seeder;

class WardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 23; $i++) {
            Ward::updateOrCreate(
                ['number' => $i],
                ['name' => "Ward $i, Nepalgunj"]
            );
        }
    }
}
