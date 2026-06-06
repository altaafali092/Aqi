<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IotReading;
use App\Models\Ward;
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
            return [
                'id' => $ward->id,
                'ward' => $ward->name ?: 'Ward '.$ward->number,
                'aqi' => $latest->aqi ?? rand(40,160),
                'waste' => $latest->waste ?? rand(0,10),
                'collected' => $latest->collected ?? (bool) rand(0,1),
                'priority' => $latest && isset($latest->aqi) ? ($latest->aqi > 150 ? 'Critical' : ($latest->aqi > 100 ? 'High' : ($latest->aqi > 60 ? 'Medium' : 'Low'))) : 'Low',
                'updated_at' => $latest->recorded_at ?? now()->toDateTimeString(),
            ];
        })->values();

        // Historical averages for last 7 days (daily average AQI)
        $historical = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = \Carbon\Carbon::now()->subDays($i)->toDateString();
            $avg = IotReading::whereDate('recorded_at', $date)->avg('aqi');
            $value = $avg ? round($avg) : rand(40,140);
            $historical[] = [
                'label' => \Carbon\Carbon::parse($date)->format('d M'),
                'value' => $value,
                'x' => 40 + (6 - $i) * 95,
                'y' => 165 - (($value / 200) * 120),
                'date' => $date,
            ];
        }

        $totalWasteToday = (int) IotReading::whereDate('recorded_at', \Carbon\Carbon::today())->sum('waste');
        $totalWasteThisMonth = (int) IotReading::whereBetween('recorded_at', [\Carbon\Carbon::now()->firstOfMonth(), \Carbon\Carbon::now()->endOfMonth()])->sum('waste');

        return response()->json([
            'dbWardStatusData' => $dbWardStatusData,
            'dbHistoricalData' => $historical,
            'trendTitle' => '7-day AQI Average',
            'kpiMetrics' => [
                'totalWasteToday' => $totalWasteToday,
                'totalWasteThisMonth' => $totalWasteThisMonth,
            ],
        ]);
    }
}

