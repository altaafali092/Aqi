<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IotReading;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class IotTelemetryController extends Controller
{
    /**
     * Store incoming IoT telemetry stream data from ESP32 microcontrollers.
     * Maps authentication tokens dynamically to target Municipal Wards.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. LIVE DEBUGGING LOG
        // This writes the incoming raw payload text directly into storage/logs/laravel.log
        Log::info('--- New ESP32 Inbound Transmission ---');
        Log::info('Raw Request Payload Data:', $request->all());

        // 2. Validate Incoming Hardware Telemetry Metrics
        $validator = Validator::make($request->all(), [
            'device_token' => 'required|string',
            'pm1_0' => 'nullable|numeric|min:0',
            'pm2_5' => 'nullable|numeric|min:0',
            'pm10' => 'nullable|numeric|min:0',
            'temperature' => 'nullable|numeric',
            'humidity' => 'nullable|numeric|min:0|max:100',
            'recorded_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            Log::warning('ESP32 Validation Failed:', $validator->errors()->toArray());

            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        // 3. Dynamic Environment Configuration Token Mapping
        $tokenWardMap = [
            env('IOT_DEVICE_TOKEN_1') => 5, // Map Secret Key 1 to Ward 5
            env('IOT_DEVICE_TOKEN_2') => 9, // Map Secret Key 2 to Ward 9
        ];

        // 4. Authenticate Device Identity
        $incomingToken = $request->input('device_token');

        if (! array_key_exists($incomingToken, $tokenWardMap)) {
            Log::error('Unauthorized connection attempt. Token mismatch: '.$incomingToken);

            return response()->json([
                'status' => 'unauthorized',
                'message' => 'Invalid device token. Device entry rejected.',
            ], 403);
        }

        // Extract corresponding ward ID assignment dynamically
        $assignedWardId = $tokenWardMap[$incomingToken];

        // 5. Database Processing Layer Execution
        try {
            $reading = IotReading::create([
                'ward_id' => $assignedWardId,
                'pm1_0' => $request->pm1_0,
                'pm2_5' => $request->pm2_5,
                'pm10' => $request->pm10,
                'temperature' => $request->temperature,
                'humidity' => $request->humidity,
                'recorded_at' => $request->recorded_at
                    ? now()->parse($request->recorded_at)
                    : now(),
            ]);

            Log::info('Telemetry recorded successfully for Ward '.$assignedWardId." [ID: {$reading->id}]");

            // Return clean API success array back to client device
            return response()->json([
                'status' => 'success',
                'message' => 'Telemetry records matched and logged for Ward '.$assignedWardId,
                'data' => $reading,
            ], 201);

        } catch (\Exception $e) {
            Log::critical('Database Write Engine Failure: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Database operation failed writing values.',
            ], 500);
        }
    }
}
