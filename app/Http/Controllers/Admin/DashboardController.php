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
                'waste' => round($ward->latestWasteCollection?->tons ?? 0, 1),
                'collected' => (bool) ($ward->latestWasteCollection?->is_collected ?? false),
                'priority' => $priority,
                'updated_at' => $ward->latestWasteCollection?->updated_at ? Carbon::parse($ward->latestWasteCollection->updated_at)->diffForHumans() : 'N/A',
            ];
        });

        // --- 2. KPI METRICS (DAILY & MONTHLY TOTALS) ---
        $wasteQueryDaily = MunicipalWaste::whereDate('created_at', Carbon::today());
        $wasteQueryMonthly = MunicipalWaste::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year);

        // Filter queries scope if citizen
        if ($role === 'citizen' && $wardId) {
            $wasteQueryDaily->where('ward_id', $wardId);
            $wasteQueryMonthly->where('ward_id', $wardId);
        }

        $totalWasteToday = $wasteQueryDaily->sum('tons');
        $totalWasteThisMonth = $wasteQueryMonthly->sum('tons');

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

        $dbHistoricalData = $historicalQuery->latest()
            ->take(7)
            ->get()
            ->reverse()
            ->values()
            ->map(function ($reading, $index) {
                return [
                    'label' => Carbon::parse($reading->created_at)->format('D'),
                    'value' => $reading->aqi,
                    'x' => 50 + ($index * 100),
                    'y' => 165 - ($reading->aqi * 0.75),
                    'date' => Carbon::parse($reading->created_at)->format('M d'),
                ];
            });

        // --- 4. RETURN STRUCT TO INERTIA FRONTEND ---
        return Inertia::render('Admin/dashboard', [
            'dbWardStatusData' => $wardStatusData, // Feeds "Your Ward Status Details" & "Garbage Accumulation Status"
            'dbHistoricalData' => $dbHistoricalData, // Feeds "Ward AQI 7-Day Trend" SVG chart
            'trendTitle' => $trendTargetName.' AQI 7-Day Trend',
            'kpiMetrics' => [
                'totalWasteToday' => round($totalWasteToday, 1),
                'totalWasteThisMonth' => round($totalWasteThisMonth, 1),
            ],
        ]);
    }
}
