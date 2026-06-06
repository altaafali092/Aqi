<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IotReading;
use App\Models\MunicipalWaste;
use App\Models\Ward;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $role = $user->role ?? 'citizen';
        $wardId = $user->ward_id;

        // --- 1. YOUR WARD STATUS DETAILS & GARBAGE ACCUMULATION STATUS ---
        $wardsQuery = Ward::query();

        // If citizen, restrict to their specific ward
        if ($role === 'citizen' && $wardId) {
            $wardsQuery->where('id', $wardId);
        }

        $wardStatusData = $wardsQuery->with([
            'latestAirQualityReading',
            'latestWasteCollection',
        ])->get()->map(function ($ward) {
            $aqi = $ward->latestAirQualityReading?->aqi ?? 0;
            $latestWaste = $ward->latestWasteCollection;

            // Dynamic priorities based on thresholds
            $priority = 'Low';
            if ($aqi > 180) {
                $priority = 'Critical';
            } elseif ($aqi > 140) {
                $priority = 'High';
            } elseif ($aqi > 95) {
                $priority = 'Medium';
            }

            return [
                'id' => $ward->id,
                'ward' => $ward->name,
                'aqi' => $aqi,
                'waste' => round(($latestWaste?->weight_kg ?? 0) / 1000, 2),
                'collected' => $latestWaste?->collection_date
                    ? ! Carbon::parse($latestWaste->collection_date)->isFuture()
                    : false,
                'priority' => $priority,
                'updated_at' => $latestWaste?->updated_at ? Carbon::parse($latestWaste->updated_at)->diffForHumans() : 'N/A',
                'kg_per_person_day' => $latestWaste?->kg_per_person_per_day,
                'health_risk_level' => $latestWaste?->health_risk_level ?? 'Low',
                'health_warning' => $latestWaste?->health_warning ?? 'No waste record available for health warning.',
                'nepal_reference_kg_per_person_day' => MunicipalWaste::NEPAL_REFERENCE_KG_PER_PERSON_DAY,
                'global_reference_kg_per_person_day' => MunicipalWaste::GLOBAL_REFERENCE_KG_PER_PERSON_DAY,
            ];
        });

        // --- 2. KPI METRICS (DAILY & MONTHLY TOTALS) ---
        $wasteQueryDaily = MunicipalWaste::whereDate('collection_date', Carbon::today());
        $wasteQueryMonthly = MunicipalWaste::whereMonth('collection_date', Carbon::now()->month)
            ->whereYear('collection_date', Carbon::now()->year);

        // Filter queries scope if citizen
        if ($role === 'citizen' && $wardId) {
            $wasteQueryDaily->where('ward_id', $wardId);
            $wasteQueryMonthly->where('ward_id', $wardId);
        }

        $totalWasteToday = $wasteQueryDaily->sum('weight_kg') / 1000;
        $totalWasteThisMonth = $wasteQueryMonthly->sum('weight_kg') / 1000;

        // --- 3. WARD AQI 7-DAY TREND (DYNAMIC OR WARD 5 SPECIFIC) ---
        $historicalQuery = IotReading::query();

        if ($role === 'citizen' && $wardId) {
            // Citizens look at their own ward data
            $historicalQuery->where('ward_id', $wardId);
            $trendTargetName = $user->ward?->name ?? 'Your Ward';
        } else {
            // Admins look up Ward 5 specifically as requested, or fall back to the first available ward if missing
            $targetWard = Ward::where('name', 'like', '%Ward 5%')->first() ?? Ward::first();
            $targetWardId = $targetWard?->id ?? 5;
            $trendTargetName = $targetWard?->name ?? 'Ward 5';

            $historicalQuery->where('ward_id', $targetWardId);
        }

        $dbHistoricalData = $historicalQuery->latest('recorded_at')
            ->take(7)
            ->get()
            ->reverse()
            ->values()
            ->map(function ($reading, $index) {
                $aqi = $reading->aqi ?? 0;

                return [
                    'label' => Carbon::parse($reading->recorded_at)->format('D'),
                    'value' => $aqi,
                    'x' => 50 + ($index * 100),
                    'y' => max(25, min(165, 165 - (($aqi / 200) * 120))),
                    'date' => Carbon::parse($reading->recorded_at)->format('M d'),
                ];
            });

        $latestLiveQuery = IotReading::with('ward')->latest('recorded_at');
        if ($role === 'citizen' && $wardId) {
            $latestLiveQuery->where('ward_id', $wardId);
        }
        $latestLiveReading = $latestLiveQuery->first();

        // --- 4. RETURN STRUCT TO INERTIA FRONTEND ---
        return Inertia::render('Admin/dashboard', [
            'dbWardStatusData' => $wardStatusData, // Feeds "Your Ward Status Details" & "Garbage Accumulation Status"
            'dbHistoricalData' => $dbHistoricalData, // Feeds "Ward AQI 7-Day Trend" SVG chart
            'trendTitle' => $trendTargetName.' AQI 7-Day Trend',
            'liveStation' => $latestLiveReading ? [
                'id' => $latestLiveReading->id,
                'ward_id' => $latestLiveReading->ward_id,
                'ward' => $latestLiveReading->ward?->name ?? 'Ward '.$latestLiveReading->ward_id,
                'aqi' => $latestLiveReading->aqi ?? 0,
                'pm2_5' => $latestLiveReading->pm2_5,
                'pm10' => $latestLiveReading->pm10,
                'recorded_at' => $latestLiveReading->recorded_at?->toDateTimeString(),
            ] : null,
            'kpiMetrics' => [
                'totalWasteToday' => round($totalWasteToday, 1),
                'totalWasteThisMonth' => round($totalWasteThisMonth, 1),
            ],
        ]);
    }
}
