<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MunicipalWasteController;
use App\Http\Controllers\Admin\WardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::resource('wards', WardController::class);
    Route::resource('municipal-wastes', MunicipalWasteController::class);
});
