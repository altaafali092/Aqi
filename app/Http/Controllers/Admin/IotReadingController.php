<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IotReading;
use App\Models\MunicipalWaste;
use App\Models\Ward;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IotReadingController extends Controller
{
    /**
     * Display a paginated listing of IoT sensor readings,
     * scoped by the user's ward if they are restricted to one.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = IotReading::with('ward')
            ->latest('recorded_at');

        // 1. Check if the user has a specific ward assigned (e.g., Citizens or Ward Officers)
        if ($user && isset($user->ward_id)) {
            // Force the query to ONLY look at the user's assigned ward
            $query->where('ward_id', $user->ward_id);

            // Overwrite any incoming ward request to match their assigned ward
            $request->merge(['ward_id' => $user->ward_id]);
        } else {
            // 2. If the user is an Admin (no fixed ward_id), allow them to filter manually
            if ($request->filled('ward_id')) {
                $query->where('ward_id', $request->ward_id);
            }
        }

        // Date range filters (apply to everyone)
        if ($request->filled('from')) {
            $query->whereDate('recorded_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('recorded_at', '<=', $request->to);
        }

        $readings = $query->paginate(20)->withQueryString();

        // 3. Filter the dropdown list for the UI
        // Admins see all options, specific ward users only see their own ward option
        $wardsQuery = Ward::orderBy('number');
        if ($user && isset($user->ward_id)) {
            $wardsQuery->where('id', $user->ward_id);
        }
        $wards = $wardsQuery->get(['id', 'number', 'name']);

        return Inertia::render('Admin/IotReadings/Index', [
            'readings' => $readings,
            'wards' => $wards,
            'filters' => $request->only(['ward_id', 'from', 'to']),
        ]);
    }

    /**
     * Provide a lightweight JSON payload for the dashboard UI.
     */
    public function dashboardData(Request $request)
    {
        $user = $request->user();

        // Base wards list (admins see all, ward users see only theirs)
        $wardsQuery = Ward::orderBy('number');
        if ($user && isset($user->ward_id)) {
            $wardsQuery->where('id', $user->ward_id);
        }
        $wards = $wardsQuery->get(['id', 'number', 'name']);

        $dbWardStatusData = $wards->map(function($ward) {
            $latest = IotReading::where('ward_id', $ward->id)->latest('recorded_at')->first();
            $latestWaste = MunicipalWaste::where('ward_id', $ward->id)->latest()->first();
            $aqi = $latest?->aqi ?? 0;

            return [
                'id' => $ward->id,
                'ward' => $ward->name ?: 'Ward '.$ward->number,
                'aqi' => $aqi,
                'waste' => round(($latestWaste?->weight_kg ?? 0) / 1000, 2),
                'collected' => $latestWaste?->collection_date
                    ? ! Carbon::parse($latestWaste->collection_date)->isFuture()
                    : false,
                'priority' => $aqi > 180 ? 'Critical' : ($aqi > 140 ? 'High' : ($aqi > 95 ? 'Medium' : 'Low')),
                'updated_at' => $latest?->recorded_at
                    ? Carbon::parse($latest->recorded_at)->diffForHumans()
                    : 'No telemetry yet',
                'kg_per_person_day' => $latestWaste?->kg_per_person_per_day,
                'health_risk_level' => $latestWaste?->health_risk_level ?? 'Low',
                'health_warning' => $latestWaste?->health_warning ?? 'No waste record available for health warning.',
                'nepal_reference_kg_per_person_day' => MunicipalWaste::NEPAL_REFERENCE_KG_PER_PERSON_DAY,
                'global_reference_kg_per_person_day' => MunicipalWaste::GLOBAL_REFERENCE_KG_PER_PERSON_DAY,
            ];
        })->values();

        // Historical averages for last 7 days (daily average AQI)
        $historical = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $dailyReadingsQuery = IotReading::whereDate('recorded_at', $date);
            if ($user && isset($user->ward_id)) {
                $dailyReadingsQuery->where('ward_id', $user->ward_id);
            }
            $dailyAqiValues = $dailyReadingsQuery->get()->pluck('aqi')->filter(fn ($aqi) => $aqi !== null);
            $value = $dailyAqiValues->isNotEmpty() ? (int) round($dailyAqiValues->avg()) : 0;
            $historical[] = [
                'label' => Carbon::parse($date)->format('d M'),
                'value' => $value,
                'x' => 40 + (6 - $i) * 95,
                'y' => max(25, min(165, 165 - (($value / 200) * 120))),
                'date' => $date,
            ];
        }

        $wasteTodayQuery = MunicipalWaste::whereDate('collection_date', Carbon::today());
        $wasteMonthQuery = MunicipalWaste::whereBetween('collection_date', [Carbon::now()->firstOfMonth(), Carbon::now()->endOfMonth()]);
        $liveStationQuery = IotReading::with('ward')->latest('recorded_at');
        if ($user && isset($user->ward_id)) {
            $wasteTodayQuery->where('ward_id', $user->ward_id);
            $wasteMonthQuery->where('ward_id', $user->ward_id);
            $liveStationQuery->where('ward_id', $user->ward_id);
        }
        $latestLiveReading = $liveStationQuery->first();
        $totalWasteToday = $wasteTodayQuery->sum('weight_kg') / 1000;
        $totalWasteThisMonth = $wasteMonthQuery->sum('weight_kg') / 1000;

        return response()->json([
            'dbWardStatusData' => $dbWardStatusData,
            'dbHistoricalData' => $historical,
            'trendTitle' => '7-day AQI Average',
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
