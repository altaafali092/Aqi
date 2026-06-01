<?php

use App\Http\Controllers\Admin\PermissionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\WardController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::resource('permissions', PermissionController::class);
    Route::resource('wards',WardController::class);
});