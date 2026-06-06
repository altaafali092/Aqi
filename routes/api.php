<?php

use App\Http\Controllers\Api\IotTelemetryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/iot/telemetry', [IotTelemetryController::class, 'store']);
