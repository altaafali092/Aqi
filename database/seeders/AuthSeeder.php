<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AuthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            [
                'name' => 'Super Admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('password'),
            ]
        );
    }
}
