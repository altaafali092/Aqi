<?php

use App\Http\Controllers\Citizen\AuthController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('citizenRegister', [AuthController::class, 'citizenRegisterPage'])->name('citizenRegister');
Route::post('citizenRegister', [AuthController::class, 'citizenRegisterStore'])->name('citizenRegisterStore');
Route::get('citizenLogin', [AuthController::class, 'citizenLoginPage'])->name('citizenLoginPage');
Route::post('citizenLogin', [AuthController::class, 'citizenLogin'])->name('citizenLogin');
Route::post('citizenLogout', [AuthController::class, 'citizenLogout'])->name('citizenLogout');

require __DIR__.'/settings.php';
