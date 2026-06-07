<?php

namespace App\Mail;

use App\Models\IotReading;
use App\Models\MunicipalWaste;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AqiWasteAlertMail extends Mailable implements ShouldQueue
{
    // REMOVED: SerializesModels trait to prevent queue serialization failures
    // when mock or unsaved model instances are passed during testing.
    use Queueable;

    public $user;

    public $iotReading;

    public $wasteRecord;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, IotReading $iotReading, ?MunicipalWaste $wasteRecord)
    {
        // Convert models to arrays or keep them as decoupled objects
        // to bypass strict database background queue lookups
        $this->user = $user;
        $this->iotReading = $iotReading;
        $this->wasteRecord = $wasteRecord;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('⚠️ CRITICAL HEALTH ALERT: High Air Pollution in Your Ward')
            ->priority(1)
            ->view('emails.aqi_waste_alert');
    }
}
