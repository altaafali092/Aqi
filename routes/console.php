<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Run the script to check environmental updates every 30 minutes
Schedule::command('environmental:check-alerts')
    ->everyTwoMinutes()
    ->withoutOverlapping();
