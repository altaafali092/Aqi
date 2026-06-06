<?php

use App\Http\Controllers\Citizen\AuthController;
use App\Mail\AlertMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('citizenRegister', [AuthController::class, 'citizenRegisterPage'])->name('citizenRegister');
Route::post('citizenRegister', [AuthController::class, 'citizenRegisterStore'])->name('citizenRegisterStore');
Route::get('citizenLogin', [AuthController::class, 'citizenLoginPage'])->name('citizenLoginPage');
Route::post('citizenLogin', [AuthController::class, 'citizenLogin'])->name('citizenLogin');
Route::post('citizenLogout', [AuthController::class, 'citizenLogout'])->name('citizenLogout');

Route::get('/send-test-email', function () {
    // The recipient address can be anything; Mailtrap traps all outgoing mail
    Mail::to('sonyrox7@gmail.com')->send(new AlertMail('Altaaf'));

    return 'Gaya mail bhaiya ';
});
require __DIR__.'/settings.php';
