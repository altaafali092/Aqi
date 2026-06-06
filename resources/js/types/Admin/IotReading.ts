import { Ward } from './Ward';

export type IotReading = {
    id: number;
    ward_id: number;
    pm1_0: number | null;
    pm2_5: number | null;
    pm10: number | null;
    temperature: number | null;
    humidity: number | null;
    heat_index: number | null;
    sensor_status: string;
    recorded_at: string;
    created_at?: string;
    updated_at?: string;
    ward?: Ward;
};
