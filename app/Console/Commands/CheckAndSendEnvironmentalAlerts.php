<?php

namespace App\Console\Commands;

use App\Mail\AqiWasteAlertMail;
use App\Models\IotReading;
use App\Models\MunicipalWaste;
use App\Models\User;
use App\Models\Ward;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class CheckAndSendEnvironmentalAlerts extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'environmental:check-alerts';

    /**
     * The console command description.
     */
    protected $description = 'Cross-references manual waste indicators against IoT sensors to dispatch health alerts to at-risk users.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting data stream comparison across municipal sectors...');

        // Pull all wards to run distinct regional cross-checks
        $wards = Ward::all();

        foreach ($wards as $ward) {
            // 1. Get the most current live telemetry reading from IoT sensors
            // 1. Get the most current live telemetry reading from IoT sensors
            $latestIotReading = IotReading::where('ward_id', $ward->id)
                ->where('sensor_status', 'active')
                ->latest('recorded_at')
                ->first();

            // 👇 FOR TESTING ONLY: Force Ward 5 to trigger an alert with high AQI values
            if ($ward->id === 5) {
                if (! $latestIotReading) {
                    $latestIotReading = new IotReading;
                }
                // Set explicit unsafe telemetry markers
                $latestIotReading->pm2_5 = 65.0; // Automatically calculates an unsafe AQI > 150
            }

            if (! $latestIotReading || is_null($latestIotReading->aqi)) {
                $this->line("Skipping Ward [{$ward->name}]: Missing live sensor telemetry.");

                continue;
            }

            // 2. Fetch the corresponding current manual waste entry data log
            $currentWasteRecord = MunicipalWaste::where('ward_id', $ward->id)
                ->latest('collection_date')
                ->first();

            // 3. Define Threshold Condition: Send alert if AQI is unsafe (> 100)
            if ($latestIotReading->aqi > 100) {

                // 4. Optimization Layer: Use Cache lock so users don't get spammed repeatedly
                // if the AQI continuously fluctuates right above and below 100.
                $cacheLockKey = "ward-alert-sent-{$ward->id}";
                if (Cache::has($cacheLockKey)) {
                    $this->line("Alert triggered for Ward [{$ward->name}], but email notifications are currently throttled.");

                    continue;
                }

                $this->warn("🚨 Unhealthy metrics detected in Ward [{$ward->name}]! AQI Level: {$latestIotReading->aqi}");

                // 5. Gather users linked specifically to this impacted ward boundary
                $affectedUsers = User::where('ward_id', $ward->id)->get();

                if ($affectedUsers->isEmpty()) {
                    $this->line("No users registered within the target geographic boundary of Ward [{$ward->name}].");

                    continue;
                }

                // 6. Batch out the emails using standard queues
                foreach ($affectedUsers as $user) {
                    Mail::to($user->email)->queue(new AqiWasteAlertMail($user, $latestIotReading, $currentWasteRecord));
                }

                // Lock this ward's alerts for the next 12 hours to avoid spamming residents
                Cache::put($cacheLockKey, true, now()->addHours(12));
                $this->info('Successfully queued health notification alerts for '.$affectedUsers->count()." citizens in Ward [{$ward->name}].");
            }
        }

        $this->info('Environmental validation checks completed successfully.');
    }
}
